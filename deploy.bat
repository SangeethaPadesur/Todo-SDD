@echo off
echo ========================================
echo TODO List App Deployment Guide
echo ========================================
echo.
echo STEP 1: Build the application
echo -------------------------------
echo Run: build.bat
echo.
echo STEP 2: Choose deployment option
echo ---------------------------------
echo.
echo OPTION A: Netlify (Easiest)
echo 1. Go to https://app.netlify.com
echo 2. Drag and drop the 'dist' folder
echo 3. Get your URL instantly
echo.
echo OPTION B: Vercel (Recommended)
echo 1. Go to https://vercel.com
echo 2. Click "New Project"
echo 3. Upload the project folder
echo 4. Get your URL
echo.
echo OPTION C: GitHub Pages (Free)
echo 1. Push to GitHub repository
echo 2. Enable GitHub Pages in settings
echo 3. Select source as 'main' branch
echo 4. Get URL: username.github.io/todo-app
echo.
echo OPTION D: Local Testing
echo 1. Run: npm run preview
echo 2. Open http://localhost:4173
echo.
echo After deployment, share the URL with others!
echo.
pause
