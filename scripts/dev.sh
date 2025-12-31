#!/bin/bash

# Morning Reader - Fullstack Dev Startup Script

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( dirname "$SCRIPT_DIR" )"

echo "🚀 Starting Morning Reader Fullstack System..."

# 1. Start BFF Backend
echo "📡 Starting Backend (BFF) on port 4000..."
cd "$ROOT_DIR/server" && npm run dev &
BACKEND_PID=$!

# 2. Start Frontend Client
echo "💻 Starting Frontend Client on port 3000..."
cd "$ROOT_DIR/client" && npm run dev &
FRONTEND_PID=$!

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap CTRL+C
trap cleanup SIGINT

echo "✅ System is running!"
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend:  http://localhost:4000"
echo "按 CTRL+C 停止所有服务"

# Keep the script running
wait
