@echo off
title Lagos Prime Real Estate - Local Dev Server
echo ========================================================
echo   Starting Lagos Prime Real Estate Development Server
echo ========================================================
echo.

echo [1/2] Checking and installing npm packages...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed. Please make sure Node.js is installed from https://nodejs.org/
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Launching server on http://localhost:3000 ...
echo Press Ctrl + C to stop the server anytime.
echo.
call npm run dev
pause
