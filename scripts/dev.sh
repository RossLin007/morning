#!/bin/bash

# Morning Reader - Fullstack Dev Startup Script

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( dirname "$SCRIPT_DIR" )"

BACKEND_PORT=4000
FRONTEND_PORT=3000

echo "🚀 Starting Morning Reader Fullstack System..."

# Check if ports are available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use!"
        echo "   Run: lsof -i :$1 to find the process"
        return 1
    fi
    return 0
}

if ! check_port $BACKEND_PORT || ! check_port $FRONTEND_PORT; then
    echo "❌ Please free up the ports and try again."
    exit 1
fi

# Check if node_modules exist
if [ ! -d "$ROOT_DIR/server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd "$ROOT_DIR/server" && npm install
fi

if [ ! -d "$ROOT_DIR/client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd "$ROOT_DIR/client" && npm install
fi

# Store PIDs for cleanup
PIDS=()

# Function to handle shutdown
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
    done
    # Also kill any child processes
    pkill -P $$ 2>/dev/null || true
    echo "👋 Goodbye!"
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM EXIT

# 1. Start BFF Backend
echo "📡 Starting Backend (BFF) on port $BACKEND_PORT..."
cd "$ROOT_DIR/server" && npm run dev &
PIDS+=($!)

# Give backend a moment to start
sleep 2

# 2. Start Frontend Client
echo "💻 Starting Frontend Client on port $FRONTEND_PORT..."
cd "$ROOT_DIR/client" && npm run dev &
PIDS+=($!)

echo ""
echo "✅ System is running!"
echo "🔗 Frontend: http://localhost:$FRONTEND_PORT"
echo "🔗 Backend:  http://localhost:$BACKEND_PORT"
echo ""
echo "按 CTRL+C 停止所有服务"

# Keep the script running
wait
