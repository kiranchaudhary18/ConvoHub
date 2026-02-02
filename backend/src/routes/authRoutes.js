const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    User signup
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    User login
// @access  Public
router.post('/login', login);

module.exports = router;
