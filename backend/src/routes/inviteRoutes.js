const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  sendInvite,
  sendDirectInvite,
  useInvite,
  verifyInvite,
} = require('../controllers/inviteController');

const router = express.Router();

// @route   POST /api/invites/send
// @desc    Send invite to user for specific chat
// @access  Private
router.post('/send', protect, sendInvite);

// @route   POST /api/invites/send-direct
// @desc    Send direct invite to user (without specific chat)
// @access  Private
router.post('/send-direct', protect, sendDirectInvite);

// @route   GET /api/invites/verify/:token
// @desc    Verify invite validity
// @access  Public
router.get('/verify/:token', verifyInvite);

// @route   POST /api/invites/use/:token
// @desc    Use invite and add user to chat
// @access  Private
router.post('/use/:token', protect, useInvite);

module.exports = router;
