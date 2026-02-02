@echo off
REM ConvoHub Setup Script - Windows

echo.
echo 🚀 ConvoHub - Complete Setup
echo ================================
echo.

REM Check Node.js
echo ✓ Checking Node.js...
node -v

REM Install Backend
echo.
echo 📦 Installing Backend Dependencies...
cd backend
call npm install
cd ..

REM Install Frontend  
echo.
echo 📦 Installing Frontend Dependencies...
cd frontend
call npm install
cd ..

REM Create .env if not exists
if not exist "backend\.env" (
    echo.
    echo ⚠️  Please configure backend\.env
    echo Example:
    echo PORT=5000
    echo MONGODB_URI=^<your-mongodb-url^>
    echo JWT_SECRET=^<your-secret^>
    echo EMAIL_USER=^<your-email^>
    echo EMAIL_PASS=^<your-app-password^>
)

echo.
echo ✅ Setup Complete!
echo.
echo 📝 To start the application:
echo.
echo Terminal 1 ^(Backend^):
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 ^(Frontend^):
echo   cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
pause
