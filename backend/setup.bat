@echo off
REM ConvoHub Backend Setup Script for Windows
REM This script helps set up the ConvoHub backend environment

echo.
echo ╔════════════════════════════════════════╗
echo ║     ConvoHub Backend Setup Script      ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 14+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js detected: %NODE_VERSION%
echo.

REM Check if npm is installed
echo 🔍 Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm detected: %NPM_VERSION%
echo.

REM Check if MongoDB is accessible
echo 🔍 MongoDB setup check...
echo ⚠️  MongoDB setup: Make sure MongoDB is running locally or update MONGODB_URI in .env
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

REM Check if .env file exists
echo 🔧 Setting up environment variables...
if not exist .env (
    echo 📝 Creating .env file from template...
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Database Configuration
        echo MONGODB_URI=mongodb://localhost:27017/convohub
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your_jwt_secret_key_change_this_in_production
        echo JWT_EXPIRE=7d
        echo.
        echo # Email Configuration (Nodemailer^)
        echo EMAIL_SERVICE=gmail
        echo EMAIL_USER=your_email@gmail.com
        echo EMAIL_PASS=your_app_password
        echo.
        echo # Frontend URL for invite links
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # Invite Token Expiry (in hours^)
        echo INVITE_EXPIRY=24
    ) > .env
    echo ✅ .env file created
    echo ⚠️  Please update .env with your actual values:
    echo    - JWT_SECRET: Generate a strong random string
    echo    - EMAIL_USER: Your Gmail address
    echo    - EMAIL_PASS: Gmail App Password (not regular password^)
    echo    - FRONTEND_URL: Your frontend URL
) else (
    echo ✅ .env file already exists
)
echo.

REM Display next steps
echo ╔════════════════════════════════════════╗
echo ║        Setup Complete! ✨              ║
echo ╚════════════════════════════════════════╝
echo.
echo 📝 Next Steps:
echo 1. Update .env with your configuration:
echo    notepad .env
echo.
echo 2. Make sure MongoDB is running
echo.
echo 3. Start the development server:
echo    npm run dev
echo.
echo 4. Server will run at: http://localhost:5000
echo.
echo 📚 Documentation:
echo    - API Reference: README.md
echo    - API Testing: API_TESTING.md
echo    - Deployment: DEPLOYMENT.md
echo    - Frontend Integration: FRONTEND_INTEGRATION.md
echo.
echo 🚀 To get started, run:
echo    npm run dev
echo.
pause
