const nodemailer = require('nodemailer');

// Configure email transporter
let mailTransporter;

// Simple mail transporter setup
if (process.env.NODE_ENV === 'production') {
  // Production Gmail transporter
  mailTransporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Development: Use Gmail with console fallback on error
  try {
    mailTransporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('📧 Gmail transporter configured');
  } catch (error) {
    console.error('Gmail transporter failed, using console fallback:', error);
    mailTransporter = {
      sendMail: async (options) => {
        console.log('📧 Development Email (Console Log):');
        console.log('From:', options.from);
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('=====================================');
        console.log('EMAIL CONTENT:');
        console.log(options.html);
        console.log('=====================================');
        return { messageId: 'dev-' + Date.now() };
      }
    };
  }
}

// Send invitation email
const sendInviteEmail = async (email, inviteLink, invitedBy) => {
  try {
    console.log('sendInviteEmail called for:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@convohub.com',
      to: email,
      subject: `You're invited to join ConvoHub!`,
      html: `
        <h2>Welcome to ConvoHub!</h2>
        <p>Hi,</p>
        <p><strong>${invitedBy}</strong> has invited you to join ConvoHub, a modern real-time chat application.</p>
        <p>Click the link below to sign up and start chatting:</p>
        <a href="${inviteLink}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        ">
          Accept Invite & Sign Up
        </a>
        <p>Or copy this link: ${inviteLink}</p>
        <p>This link expires in 24 hours.</p>
        <p>Best regards,<br>ConvoHub Team</p>
      `,
    };

    console.log('Sending email with transporter...');
    const result = await mailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    // If this was a real Gmail send, note that
    if (result.messageId && !result.messageId.startsWith('dev-')) {
      console.log('✅ Real email sent via Gmail');
    } else {
      console.log('💻 Development mode - email content logged above');
    }
    
    return true;
  } catch (error) {
    console.error('=== Error sending email ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // If Gmail fails in development, fallback to console logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Gmail failed, showing email content instead:');
      console.log('To:', email);
      console.log('Subject: You\'re invited to join ConvoHub!');
      console.log('From:', invitedBy);
      console.log('Link:', inviteLink);
      console.log('This would be sent via email in production with proper Gmail setup');
      return true;  // Return true so UI shows success
    }
    
    return false;
  }
};

module.exports = {
  mailTransporter,
  sendInviteEmail,
};
