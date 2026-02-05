require('dotenv').config();
const { sendInviteEmail } = require('./src/config/mail');

const testEmail = async () => {
  try {
    console.log('Environment variables:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '*hidden*' : 'NOT SET');
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    
    console.log('Testing email functionality...');
    const result = await sendInviteEmail(
      'test@example.com',
      'http://localhost:3000/register?invite=test123',
      'Test User'
    );
    console.log('Email test result:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
};

testEmail();