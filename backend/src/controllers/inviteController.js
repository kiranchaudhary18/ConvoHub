const Invite = require('../models/Invite');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { sendInviteEmail } = require('../config/mail');
const crypto = require('crypto');

// @desc    Send invite to user
// @route   POST /api/invites/send
// @access  Private
const sendInvite = async (req, res) => {
  try {
    const { email, chatId } = req.body;
    const invitedById = req.user.id;

    if (!email || !chatId) {
      return res.status(400).json({
        success: false,
        message: 'Email and Chat ID are required',
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

    // Check if user is member of the chat
    if (!chat.members.includes(invitedById)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this chat',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists, just add to chat if not already a member
      if (!chat.members.includes(existingUser._id)) {
        chat.members.push(existingUser._id);
        await chat.save();
      }

      return res.status(200).json({
        success: true,
        message: 'User already registered and added to chat',
      });
    }

    // Check if an invite already exists for this email and chat
    let invite = await Invite.findOne({
      email,
      chatId,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (invite) {
      return res.status(200).json({
        success: true,
        message: 'Invite already sent to this email',
        invite,
      });
    }

    // Create new invite
    const expiresAt = new Date(Date.now() + parseInt(process.env.INVITE_EXPIRY || 24) * 60 * 60 * 1000);

    invite = await Invite.create({
      email: email.toLowerCase(),
      invitedBy: invitedById,
      chatId,
      expiresAt,
    });

    // Get inviter details
    const inviter = await User.findById(invitedById);

    // Generate invite link
    const inviteLink = `${process.env.FRONTEND_URL}/auth/signup?invite=${invite.token}`;

    // Send email
    const emailSent = await sendInviteEmail(email, inviteLink, inviter.name);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send invitation email',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      invite,
    });
  } catch (error) {
    console.error('Send invite error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify and use invite
// @route   POST /api/invites/use/:token
// @access  Public
const useInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invite token is required',
      });
    }

    // Find invite
    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite link',
      });
    }

    // Check if invite is already used
    if (invite.used) {
      return res.status(400).json({
        success: false,
        message: 'This invite has already been used',
      });
    }

    // Check if invite is expired
    if (new Date() > invite.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Invite link has expired',
      });
    }

    // Get chat
    const chat = await Chat.findById(invite.chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Add user to chat if not already a member
    if (!chat.members.includes(userId)) {
      chat.members.push(userId);
      await chat.save();
    }

    // Mark invite as used
    invite.used = true;
    invite.usedBy = userId;
    invite.usedAt = new Date();
    await invite.save();

    // Populate chat details
    const updatedChat = await chat.populate('members admin', '-password').populate('lastMessage');

    return res.status(200).json({
      success: true,
      message: 'Invite used successfully. You have been added to the chat!',
      chat: updatedChat,
    });
  } catch (error) {
    console.error('Use invite error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify invite validity
// @route   GET /api/invites/verify/:token
// @access  Public
const verifyInvite = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invite token is required',
      });
    }

    const invite = await Invite.findOne({ token }).populate('invitedBy', 'name');

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invite link',
      });
    }

    // Check if invite is already used
    if (invite.used) {
      return res.status(400).json({
        success: false,
        message: 'This invite has already been used',
      });
    }

    // Check if invite is expired
    if (new Date() > invite.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Invite link has expired',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Invite is valid',
      invite: {
        token,
        email: invite.email,
        invitedBy: invite.invitedBy.name,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    console.error('Verify invite error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendInvite,
  useInvite,
  verifyInvite,
};
