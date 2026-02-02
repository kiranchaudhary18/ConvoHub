const User = require('../models/User');

// @desc    Get all users except logged-in user
// @route   GET /api/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all users except the logged-in user
    const users = await User.find({ _id: { $ne: userId } })
      .select('-password')
      .lean();

    // Get total count of all users
    const totalUsers = await User.countDocuments();

    console.log(`Fetching users - Total in DB: ${totalUsers}, Returning: ${users.length} (excluding current user)`);
    console.log('Users:', users.map(u => ({ name: u.name, email: u.email, isOnline: u.isOnline })));

    return res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      users,
    });
  } catch (error) {
    console.error('Get users error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lastSeen timestamp
// @route   PUT /api/users/lastseen
// @access  Private
const updateLastSeen = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { lastSeen: new Date() },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Update lastSeen error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user online status
// @route   PUT /api/users/online-status
// @access  Private
const updateOnlineStatus = async (req, res) => {
  try {
    const { isOnline } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isOnline, lastSeen: new Date() },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Update online status error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateLastSeen,
  updateOnlineStatus,
};
