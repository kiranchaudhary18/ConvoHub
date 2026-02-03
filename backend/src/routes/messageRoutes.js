const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/messageController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/messages
// @desc    Send message
// @access  Private
router.post('/', sendMessage);

// @route   POST /api/messages/upload
// @desc    Upload file/image
// @access  Private
router.post('/upload', uploadFile);

// @route   GET /api/messages/:chatId
// @desc    Get messages for a chat
// @access  Private
router.get('/:chatId', getMessages);

// @route   PUT /api/messages/:messageId/mark-seen
// @desc    Mark message as seen
// @access  Private
router.put('/:messageId/mark-seen', markMessageAsSeen);

// @route   PUT /api/messages/chat/:chatId/mark-all-seen
// @desc    Mark all messages in chat as seen
// @access  Private
router.put('/chat/:chatId/mark-all-seen', markAllMessagesAsSeen);

// @route   PUT /api/messages/:messageId/edit
// @desc    Edit message (only once)
// @access  Private
router.put('/:messageId/edit', editMessage);

// @route   DELETE /api/messages/:messageId
// @desc    Delete message (for me only)
// @access  Private
router.delete('/:messageId', deleteMessage);

// @route   DELETE /api/messages/:messageId/delete-for-me
// @desc    Delete message for me only
// @access  Private
router.delete('/:messageId/delete-for-me', deleteMessageForMe);

// @route   DELETE /api/messages/:messageId/delete-for-everyone
// @desc    Delete message for everyone
// @access  Private
router.delete('/:messageId/delete-for-everyone', deleteMessageForEveryone);

// @route   POST /api/messages/:messageId/react
// @desc    Add or update reaction to message
// @access  Private
router.post('/:messageId/react', addReaction);

// @route   DELETE /api/messages/:messageId/react
// @desc    Remove reaction from message
// @access  Private
router.delete('/:messageId/react', removeReaction);

// @route   PUT /api/messages/:messageId/pin
// @desc    Toggle pin message
// @access  Private
router.put('/:messageId/pin', togglePinMessage);

module.exports = router;
