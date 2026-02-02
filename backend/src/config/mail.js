const nodemailer = require('nodemailer');

// Configure email transporter
const mailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send invitation email
const sendInviteEmail = async (email, inviteLink, invitedBy) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
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

    await mailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};

module.exports = {
  mailTransporter,
  sendInviteEmail,
};
