const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Create or get one-to-one chat
// @route   POST /api/chats/one-to-one
// @access  Private
const createOrGetOneToOneChat = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user.id;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID is required',
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [userId, recipientId] },
    }).populate('members', '-password').populate('lastMessage');

    if (chat) {
      return res.status(200).json({
        success: true,
        message: 'Chat retrieved',
        chat,
      });
    }

    // Create new chat
    chat = await Chat.create({
      isGroup: false,
      members: [userId, recipientId],
    });

    chat = await chat.populate('members', '-password');

    return res.status(201).json({
      success: true,
      message: 'Chat created',
      chat,
    });
  } catch (error) {
    console.error('Create/Get chat error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create group chat
// @route   POST /api/chats/group
// @access  Private
const createGroupChat = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const userId = req.user.id;

    if (!name || !memberIds || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Group name and members are required',
      });
    }

    // Add current user to members if not already present
    const allMembers = new Set([userId, ...memberIds]);
    const membersArray = Array.from(allMembers);

    // Validate all members exist
    const users = await User.find({ _id: { $in: membersArray } });
    if (users.length !== membersArray.length) {
      return res.status(400).json({
        success: false,
        message: 'Some members do not exist',
      });
    }

    const chat = await Chat.create({
      isGroup: true,
      name,
      members: membersArray,
      admin: userId,
    });

    const populatedChat = await chat.populate('members admin', '-password');

    return res.status(201).json({
      success: true,
      message: 'Group created successfully',
      chat: populatedChat,
    });
  } catch (error) {
    console.error('Create group error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all chats for logged-in user
// @route   GET /api/chats
// @access  Private
const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ members: userId })
      .populate('members', '-password')
      .populate('lastMessage')
      .populate('admin', '-password')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error('Get chats error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add member to group chat
// @route   PUT /api/chats/:chatId/add-member
// @access  Private
const addMemberToGroup = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID is required',
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is admin
    if (chat.admin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only admin can add members',
      });
    }

    // Check if member already exists
    if (chat.members.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: 'Member already in group',
      });
    }

    // Check if member exists
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    chat.members.push(memberId);
    await chat.save();

    const updatedChat = await chat.populate('members admin', '-password').populate('lastMessage');

    return res.status(200).json({
      success: true,
      message: 'Member added successfully',
      chat: updatedChat,
    });
  } catch (error) {
    console.error('Add member error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove member from group chat
// @route   PUT /api/chats/:chatId/remove-member
// @access  Private
const removeMemberFromGroup = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if user is admin
    if (chat.admin.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only admin can remove members',
      });
    }

    // Remove member
    chat.members = chat.members.filter((id) => id.toString() !== memberId);
    await chat.save();

    const updatedChat = await chat.populate('members admin', '-password').populate('lastMessage');

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      chat: updatedChat,
    });
  } catch (error) {
    console.error('Remove member error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrGetOneToOneChat,
  createGroupChat,
  getAllChats,
  addMemberToGroup,
  removeMemberFromGroup,
};
