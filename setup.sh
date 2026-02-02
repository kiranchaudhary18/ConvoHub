#!/bin/bash

# ConvoHub Setup Script - Linux/macOS

echo "🚀 ConvoHub - Complete Setup"
echo "================================"

# Check Node.js
echo "✓ Checking Node.js..."
node -v

# Install Backend
echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
cd ..

# Install Frontend  
echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

# Create .env if not exists
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "⚠️  Please configure backend/.env"
    echo "Example:"
    echo "PORT=5000"
    echo "MONGODB_URI=<your-mongodb-url>"
    echo "JWT_SECRET=<your-secret>"
    echo "EMAIL_USER=<your-email>"
    echo "EMAIL_PASS=<your-app-password>"
fi

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
