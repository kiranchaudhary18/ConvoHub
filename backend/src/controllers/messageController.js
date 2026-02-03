const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
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
    if (!chat.members.includes(senderId)) {
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
      seenBy: [senderId], // Message is seen by sender
    });

    // Populate sender details
    const populatedMessage = await message.populate('senderId', '-password');

    // Update chat's lastMessage and updatedAt
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        lastMessage: message._id,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('members', '-password').populate('lastMessage');

    const responseData = {
      _id: populatedMessage._id,
      chatId,
      senderId: populatedMessage.senderId,
      text: populatedMessage.text,
      type: 'text',
      seenBy: populatedMessage.seenBy,
      createdAt: populatedMessage.createdAt,
    };

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(chatId).emit('new-message', responseData);

      // If it's the first message, notify all chat members about the new chat
      if (isFirstMessage) {
        chat.members.forEach((memberId) => {
          io.to(memberId).emit('new-chat', {
            chat: updatedChat.toObject(),
            createdBy: senderId,
          });
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent',
      data: responseData,
    });
  } catch (error) {
    console.error('Send message error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
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
    if (!chat.members.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this chat',
      });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId })
      .populate('senderId', '-password')
      .populate('seenBy', '-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const totalMessages = await Message.countDocuments({ chatId });

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
    if (!chat.members.includes(senderId)) {
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

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
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

    // Only sender can delete
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages',
      });
    }

    // Mark as deleted
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
      message: 'Message deleted',
      data: responseData,
    });
  } catch (error) {
    console.error('Delete message error:', error.message);
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
};
