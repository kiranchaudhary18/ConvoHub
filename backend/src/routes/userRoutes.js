const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserProfile,
  updateLastSeen,
  updateOnlineStatus,
} = require('../controllers/userController');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users except logged-in user
// @access  Private
router.get('/', getAllUsers);

// @route   GET /api/users/profile
// @desc    Get logged-in user profile
// @access  Private
router.get('/profile', getUserProfile);

// @route   PUT /api/users/lastseen
// @desc    Update lastSeen timestamp
// @access  Private
router.put('/lastseen', updateLastSeen);

// @route   PUT /api/users/online-status
// @desc    Update online status
// @access  Private
router.put('/online-status', updateOnlineStatus);

module.exports = router;
