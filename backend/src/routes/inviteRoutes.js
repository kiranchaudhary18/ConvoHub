const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendInvite,
  useInvite,
  verifyInvite,
} = require('../controllers/inviteController');

const router = express.Router();

// @route   POST /api/invites/send
// @desc    Send invite to user
// @access  Private
router.post('/send', protect, sendInvite);

// @route   GET /api/invites/verify/:token
// @desc    Verify invite validity
// @access  Public
router.get('/verify/:token', verifyInvite);

// @route   POST /api/invites/use/:token
// @desc    Use invite and add user to chat
// @access  Private
router.post('/use/:token', protect, useInvite);

module.exports = router;
