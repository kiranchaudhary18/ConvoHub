@echo off
echo ====================================
echo Updating Vercel Environment Variables
echo ====================================
echo.

echo Setting EMAIL_USER...
vercel env rm EMAIL_USER production
vercel env add EMAIL_USER production
echo kiranchaudhary1622@gmail.com

echo.
echo Setting EMAIL_PASS...
vercel env rm EMAIL_PASS production
vercel env add EMAIL_PASS production
echo nyxywffougraqccs

echo.
echo ====================================
echo Environment variables updated!
echo Now redeploying...
echo ====================================
vercel --prod

echo.
echo Done! Check your deployment at Vercel dashboard.
pause
