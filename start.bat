@echo off
echo ========================================
echo TODO List Application Setup
echo ========================================
echo.
echo Installing dependencies...
cd /d "c:\Sangeetha\Learnings\todo-app"
call npm install
echo.
echo Starting development server...
call npm run dev
