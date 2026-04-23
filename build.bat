@echo off
echo ========================================
echo Building TODO List Application
echo ========================================
echo.
cd /d "c:\Sangeetha\Learnings\todo-app"
echo Installing dependencies...
call npm install
echo.
echo Building for production...
call npm run build
echo.
echo Build complete!
echo The application is ready in the 'dist' folder.
echo.
echo Next steps:
echo 1. Upload the 'dist' folder to a hosting service
echo 2. Configure SPA routing (serve index.html for all routes)
echo 3. Share the URL with others
echo.
pause
