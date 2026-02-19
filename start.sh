#!/bin/bash

# Star Math Explorer - Unix/Mac Startup Script
# Developer: Rohith Kumar | CB.SC.U4CSE23018

echo ""
echo "==============================================="
echo "  🚀 STAR MATH EXPLORER - Startup Script"
echo "==============================================="
echo ""
echo "Starting backend and frontend servers..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js detected:"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm is not installed!"
    echo "Please install npm"
    exit 1
fi

echo "✅ npm detected:"
npm --version
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Start Backend Server
echo "📦 Starting Backend Server on port 3000..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm start &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

cd ..
sleep 3

# Start Frontend Server
echo "🎨 Starting Frontend Server on port 5173..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

cd ..
sleep 2

echo ""
echo "==============================================="
echo "  ✨ Servers are running!"
echo "==============================================="
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 Backend: http://localhost:3000"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop the servers, press Ctrl+C"
echo "or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "==============================================="
echo "  Happy Learning! 🌟"
echo "==============================================="
echo ""

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; echo 'Servers stopped.'; exit" INT

# Keep script running
wait
