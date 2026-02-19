@echo off
REM Star Math Explorer - Windows Startup Script
REM Developer: Rohith Kumar | CB.SC.U4CSE23018

echo.
echo ===============================================
echo   🚀 STAR MATH EXPLORER - Startup Script  
echo ===============================================
echo.
echo Starting backend and frontend servers...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version
echo.

REM Start Backend Server
echo 📦 Starting Backend Server on port 3000...
start "Star Math Explorer - Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo 🎨 Starting Frontend Server on port 5173...
start "Star Math Explorer - Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ===============================================
echo   ✨ Servers are starting!  
echo ===============================================
echo.
echo 🌐 Frontend will be available at: http://localhost:5173
echo 🔌 Backend will be available at: http://localhost:3000
echo.
echo Two new terminal windows have been opened.
echo.
echo ⚠️ Do NOT close those windows while using the app!
echo.
echo To stop the servers, close both terminal windows
echo or press Ctrl+C in each window.
echo.
echo ===============================================
echo   Happy Learning! 🌟
echo ===============================================
echo.
pause
