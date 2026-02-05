const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrGetOneToOneChat,
  createGroupChat,
  getAllChats,
  addMemberToGroup,
  removeMemberFromGroup,
  leaveGroup,
  deleteGroup,
} = require('../controllers/chatController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/chats/one-to-one
// @desc    Create or get one-to-one chat
// @access  Private
router.post('/one-to-one', createOrGetOneToOneChat);

// @route   POST /api/chats/group
// @desc    Create group chat
// @access  Private
router.post('/group', createGroupChat);

// @route   GET /api/chats
// @desc    Get all chats for logged-in user
// @access  Private
router.get('/', getAllChats);

// @route   PUT /api/chats/:chatId/add-member
// @desc    Add member to group chat
// @access  Private
router.put('/:chatId/add-member', addMemberToGroup);

// @route   PUT /api/chats/:chatId/remove-member
// @desc    Remove member from group chat
// @access  Private
router.put('/:chatId/remove-member', removeMemberFromGroup);

// @route   PUT /api/chats/:chatId/leave
// @desc    Leave group (member removes themselves)
// @access  Private
router.put('/:chatId/leave', leaveGroup);

// @route   DELETE /api/chats/:chatId
// @desc    Delete group (admin only)
// @access  Private
router.delete('/:chatId', deleteGroup);

module.exports = router;
