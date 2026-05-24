@echo off
setlocal
cd /d "%~dp0"

title YouTube Audio Downloader

echo Starting YouTube Audio Downloader...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not added to PATH.
  echo Please install Node.js LTS from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies for the first run...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Please check your Node.js installation.
    pause
    exit /b 1
  )
)

echo Opening app in your browser...
start "" "http://localhost:3000"
echo.
echo Keep this window open while using the app.
echo Close this window to stop the server.
echo.

node server.js

pause
