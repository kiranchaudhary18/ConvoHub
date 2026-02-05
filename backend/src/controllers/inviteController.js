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

// @desc    Send direct invite to user (without specific chat)
// @route   POST /api/invites/send-direct
// @access  Private
const sendDirectInvite = async (req, res) => {
  try {
    console.log('=== sendDirectInvite API called ===');
    const { email } = req.body;
    const invitedById = req.user.id;

    console.log('Input email:', email);
    console.log('Inviter ID:', invitedById);
    console.log('Email config exists:', !!process.env.EMAIL_SERVICE);

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.log('Email validation failed');
      return res.status(400).json({
        success: false,
        message: 'Valid email is required',
      });
    }

    const emailLower = email.toLowerCase().trim();
    console.log('Processing email:', emailLower);

    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      console.log('User already exists:', existingUser._id);
      return res.status(200).json({
        success: true,
        message: 'User already registered. You can start chatting!',
      });
    }

    // Get inviter details
    console.log('Fetching inviter...');
    const inviter = await User.findById(invitedById);
    if (!inviter) {
      console.log('Inviter not found');
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('Inviter:', inviter.name);

    // Check if invite already exists and is not expired
    console.log('Checking for existing invite...');
    let existingInvite = await Invite.findOne({
      email: emailLower,
      chatId: null,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingInvite) {
      console.log('Invite already exists, reusing token:', existingInvite.token);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      const inviteLink = `${frontendURL}/register?invite=${existingInvite.token}`;
      console.log('Sending email to existing invite recipient');
      
      const emailSent = await sendInviteEmail(emailLower, inviteLink, inviter.name);
      if (!emailSent) {
        console.error('Failed to send email');
        return res.status(500).json({
          success: false,
          message: 'Failed to send invitation email. Please try again.',
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Invitation sent successfully! Check your email for the link.',
      });
    }

    // Create new invite
    console.log('Creating new invite record...');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const newInvite = await Invite.create({
      email: emailLower,
      invitedBy: invitedById,
      chatId: null,
      expiresAt: expiresAt,
      used: false,
    });

    console.log('Invite created:', newInvite._id, 'Token:', newInvite.token);

    // Generate invite link
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const inviteLink = `${frontendURL}/register?invite=${newInvite.token}`;

    console.log('Sending invitation email to:', emailLower);
    console.log('Invite link:', inviteLink);

    // Send email
    const emailSent = await sendInviteEmail(emailLower, inviteLink, inviter.name);
    
    if (!emailSent) {
      console.error('Email sending failed');
      return res.status(500).json({
        success: false,
        message: 'Failed to send invitation email. Please try again.',
      });
    }

    console.log('Email sent successfully!');

    return res.status(201).json({
      success: true,
      message: 'Invitation sent successfully! Check your email for the link.',
    });
  } catch (error) {
    console.error('=== sendDirectInvite ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    // Provide helpful error messages for common issues
    let errorMessage = 'Failed to send invitation';
    
    if (error.code === 11000) {
      errorMessage = 'An invite has already been sent to this email';
    } else if (error.message.includes('email')) {
      errorMessage = 'Invalid email address';
    } else if (error.message.includes('validation')) {
      errorMessage = 'Invalid data provided';
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  sendInvite,
  sendDirectInvite,
  useInvite,
  verifyInvite,
};
