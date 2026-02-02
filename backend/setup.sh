#!/bin/bash

# ConvoHub Backend Setup Script
# This script helps set up the ConvoHub backend environment

echo "╔════════════════════════════════════════╗"
echo "║     ConvoHub Backend Setup Script      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
echo "🔍 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js detected: $NODE_VERSION"
echo ""

# Check if npm is installed
echo "🔍 Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm detected: $NPM_VERSION"
echo ""

# Check if MongoDB is accessible
echo "🔍 Checking MongoDB connection..."
# This is a simple check; actual connection test happens at runtime
echo "⚠️  MongoDB setup: Make sure MongoDB is running locally or update MONGODB_URI in .env"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Check if .env file exists
echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cat > .env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/convohub

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL for invite links
FRONTEND_URL=http://localhost:3000

# Invite Token Expiry (in hours)
INVITE_EXPIRY=24
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your actual values:"
    echo "   - JWT_SECRET: Generate a strong random string"
    echo "   - EMAIL_USER: Your Gmail address"
    echo "   - EMAIL_PASS: Gmail App Password (not regular password)"
    echo "   - FRONTEND_URL: Your frontend URL"
else
    echo "✅ .env file already exists"
fi
echo ""

# Display next steps
echo "╔════════════════════════════════════════╗"
echo "║        Setup Complete! ✨              ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "📝 Next Steps:"
echo "1. Update .env with your configuration:"
echo "   nano .env"
echo ""
echo "2. Make sure MongoDB is running:"
echo "   mongod"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Server will run at: http://localhost:5000"
echo ""
echo "📚 Documentation:"
echo "   - API Reference: README.md"
echo "   - API Testing: API_TESTING.md"
echo "   - Deployment: DEPLOYMENT.md"
echo "   - Frontend Integration: FRONTEND_INTEGRATION.md"
echo ""
echo "🚀 To get started, run:"
echo "   npm run dev"
echo ""
