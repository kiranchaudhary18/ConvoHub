const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getMessages,
  markMessageAsSeen,
  markAllMessagesAsSeen,
  uploadFile,
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

module.exports = router;
