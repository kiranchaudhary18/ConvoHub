const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { chatId, text, replyTo } = req.body;
    const senderId = req.user.id;

    if (!chatId || !text) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID and message text are required',
      });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is a member of the chat
    const isMember = chat.members.some(member => {
      const memberId = typeof member === 'object' ? member._id || member.id : member;
      return memberId.toString() === senderId.toString();
    });
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this chat',
      });
    }

    // Check if this is the first message in the chat
    const messageCount = await Message.countDocuments({ chatId });
    const isFirstMessage = messageCount === 0;

    // Create message
    const message = await Message.create({
      chatId,
      senderId,
      text,
      replyTo: replyTo || null,
      seenBy: [senderId], // Message is seen by sender
    });

    // Populate sender details and reply message if exists
    let populatedMessage = await message.populate('senderId', '-password');
    
    if (message.replyTo) {
      populatedMessage = await populatedMessage.populate({
        path: 'replyTo',
        populate: { path: 'senderId', select: 'name email' }
      });
    }

    // Update chat's lastMessage and updatedAt
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: message._id,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('members', '-password').populate('lastMessage');

    if (!updatedChat) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update chat',
      });
    }

    const responseData = {
      _id: populatedMessage._id,
      chatId,
      senderId: populatedMessage.senderId,
      text: populatedMessage.text,
      type: 'text',
      replyTo: populatedMessage.replyTo || null,
      seenBy: populatedMessage.seenBy,
      createdAt: populatedMessage.createdAt,
    };

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io && updatedChat.members) {
      // Emit to chat room (for users who have joined)
      io.to(chatId).emit('new-message', responseData);
      
      // Also emit to individual users' personal rooms (for users who haven't joined the room yet)
      try {
        updatedChat.members.forEach((member) => {
          const memberId = typeof member === 'object' ? member._id : member;
          if (memberId) {
            io.to(`user-${memberId}`).emit('new-message', responseData);
          }
        });
      } catch (socketError) {
        // Socket emit error - continue processing
      }

      // If it's the first message, notify all chat members about the new chat
      if (isFirstMessage) {
        try {
          updatedChat.members.forEach((member) => {
            // member can be an object (populated) or string (ID)
            const memberId = typeof member === 'object' ? member._id : member;
            if (memberId) {
              io.to(`user-${memberId}`).emit('new-chat', {
                chat: updatedChat.toObject(),
                createdBy: senderId,
              });
            }
          });
        } catch (socketError) {
          // Socket emit error - continue processing
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent',
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

// @desc    Get messages for a chat
// @route   GET /api/messages/:chatId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is a member of the chat
    const isMember = chat.members.some(member => {
      const memberId = typeof member === 'object' ? member._id || member.id : member;
      return memberId.toString() === userId.toString();
    });
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this chat',
      });
    }

    const skip = (page - 1) * limit;

    // Filter out messages deleted for current user
    const messages = await Message.find({ 
      chatId,
      deletedFor: { $ne: userId }
    })
      .populate('senderId', '-password')
      .populate('seenBy', '-password')
      .populate({
        path: 'replyTo',
        populate: { path: 'senderId', select: 'name email' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count (excluding messages deleted for user)
    const totalMessages = await Message.countDocuments({ 
      chatId,
      deletedFor: { $ne: userId }
    });

    return res.status(200).json({
      success: true,
      totalMessages,
      page: parseInt(page),
      limit: parseInt(limit),
      messages: messages.reverse(), // Return oldest first for better UX
    });
  } catch (error) {
    console.error('Get messages error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark message as seen
// @route   PUT /api/messages/:messageId/mark-seen
// @access  Private
const markMessageAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check if user already marked it as seen
    if (!message.seenBy.includes(userId)) {
      message.seenBy.push(userId);
      await message.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Message marked as seen',
      data: message,
    });
  } catch (error) {
    console.error('Mark seen error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark all messages in chat as seen
// @route   PUT /api/messages/chat/:chatId/mark-all-seen
// @access  Private
const markAllMessagesAsSeen = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { chatId, seenBy: { $ne: userId } },
      { $push: { seenBy: userId } }
    );

    return res.status(200).json({
      success: true,
      message: 'All messages marked as seen',
    });
  } catch (error) {
    console.error('Mark all seen error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload file/image
// @route   POST /api/messages/upload
// @access  Private
const uploadFile = async (req, res) => {
  try {
    const { chatId } = req.body;
    const senderId = req.user.id;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided',
      });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is a member of the chat
    const isMember = chat.members.some(member => {
      const memberId = typeof member === 'object' ? member._id || member.id : member;
      return memberId.toString() === senderId.toString();
    });
    
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this chat',
      });
    }

    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;
    
    // Determine file type
    const isImage = mimeType.startsWith('image/');
    const fileType = isImage ? 'image' : 'file';

    // Upload to Cloudinary
    let fileUrl;
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'convohub/messages',
            public_id: `${Date.now()}_${fileName.split('.')[0]}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      
      fileUrl = uploadResult.secure_url;
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to Cloudinary',
        error: cloudinaryError.message,
      });
    }

    // Create message with Cloudinary URL
    const { caption } = req.body;
    const messageText = caption?.trim() ? caption : `📎 ${fileName}`;

    const message = await Message.create({
      chatId,
      senderId,
      text: messageText,
      fileUrl,
      fileName,
      type: fileType,
      seenBy: [senderId],
    });

    // Populate sender details
    const populatedMessage = await message.populate('senderId', '-password');

    // Update chat's lastMessage and updatedAt
    await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: message._id,
        updatedAt: new Date(),
      },
      { new: true }
    );

    const responseData = {
      _id: message._id,
      chatId,
      senderId: populatedMessage.senderId,
      text: populatedMessage.text,
      fileUrl,
      fileName,
      type: fileType,
      seenBy: [senderId],
      createdAt: message.createdAt,
    };

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(chatId).emit('new-message', responseData);
    }

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: responseData,
    });
  } catch (error) {
    console.error('Upload file error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Edit message (only text, only once)
// @route   PUT /api/messages/:messageId
// @access  Private
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message text is required',
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only sender can edit
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own messages',
      });
    }

    // Can only edit once
    if (message.isEdited) {
      return res.status(400).json({
        success: false,
        message: 'Message can only be edited once',
      });
    }

    // Update message
    message.text = text.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    const populatedMessage = await message.populate('senderId', '-password');

    const responseData = {
      _id: message._id,
      chatId: message.chatId,
      senderId: populatedMessage.senderId,
      text: message.text,
      type: message.type,
      seenBy: message.seenBy,
      isEdited: message.isEdited,
      editedAt: message.editedAt,
      createdAt: message.createdAt,
    };

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-edited', responseData);
    }

    return res.status(200).json({
      success: true,
      message: 'Message edited',
      data: responseData,
    });
  } catch (error) {
    console.error('Edit message error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete message for me
// @route   DELETE /api/messages/:messageId/delete-for-me
// @access  Private
const deleteMessageForMe = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Add user to deletedFor array if not already there
    if (!message.deletedFor.includes(userId)) {
      message.deletedFor.push(userId);
      await message.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted for you',
      data: {
        _id: message._id,
        chatId: message.chatId,
        deletedForMe: true,
      },
    });
  } catch (error) {
    console.error('Delete for me error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete message for everyone
// @route   DELETE /api/messages/:messageId/delete-for-everyone
// @access  Private
const deleteMessageForEveryone = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only sender can delete for everyone
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages for everyone',
      });
    }

    // Mark as deleted for everyone
    message.isDeleted = true;
    message.deletedAt = new Date();
    message.text = 'This message was deleted';
    await message.save();

    const responseData = {
      _id: message._id,
      chatId: message.chatId,
      isDeleted: true,
      deletedAt: message.deletedAt,
    };

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-deleted', responseData);
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted for everyone',
      data: responseData,
    });
  } catch (error) {
    console.error('Delete for everyone error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Legacy endpoint - now delete for me only
const deleteMessage = async (req, res) => {
  return deleteMessageForMe(req, res);
};

// Add or update reaction
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id || req.user.id;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        message: 'Emoji is required',
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check if user already reacted
    const existingReactionIndex = message.reactions.findIndex(
      r => r.userId.toString() === userId.toString()
    );

    if (existingReactionIndex !== -1) {
      // Update existing reaction
      message.reactions[existingReactionIndex].emoji = emoji;
      message.reactions[existingReactionIndex].createdAt = new Date();
    } else {
      // Add new reaction
      message.reactions.push({
        userId,
        emoji,
        createdAt: new Date(),
      });
    }

    await message.save();

    const populatedMessage = await Message.findById(messageId)
      .populate('reactions.userId', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-reacted', {
        messageId: message._id,
        reactions: populatedMessage.reactions,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reaction added',
      data: populatedMessage.reactions,
    });
  } catch (error) {
    console.error('Add reaction error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove reaction
const removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id || req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Remove user's reaction
    message.reactions = message.reactions.filter(
      r => r.userId.toString() !== userId.toString()
    );

    await message.save();

    const populatedMessage = await Message.findById(messageId)
      .populate('reactions.userId', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-reacted', {
        messageId: message._id,
        reactions: populatedMessage.reactions,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reaction removed',
      data: populatedMessage.reactions,
    });
  } catch (error) {
    console.error('Remove reaction error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle pin message
const togglePinMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id || req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Toggle pin status
    message.isPinned = !message.isPinned;
    message.pinnedAt = message.isPinned ? new Date() : null;
    message.pinnedBy = message.isPinned ? userId : null;

    await message.save();

    const populatedMessage = await Message.findById(messageId)
      .populate('pinnedBy', 'name email');

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.to(message.chatId.toString()).emit('message-pinned', {
        messageId: message._id,
        isPinned: message.isPinned,
        pinnedAt: message.pinnedAt,
        pinnedBy: populatedMessage.pinnedBy,
      });
    }

    return res.status(200).json({
      success: true,
      message: message.isPinned ? 'Message pinned' : 'Message unpinned',
      data: {
        _id: message._id,
        isPinned: message.isPinned,
        pinnedAt: message.pinnedAt,
        pinnedBy: populatedMessage.pinnedBy,
      },
    });
  } catch (error) {
    console.error('Toggle pin error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessageAsSeen,
  markAllMessagesAsSeen,
  uploadFile,
  editMessage,
  deleteMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  addReaction,
  removeReaction,
  togglePinMessage,
};
