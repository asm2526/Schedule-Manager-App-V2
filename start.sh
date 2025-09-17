#!/bin/bash

# Always run from project root
cd "$(dirname "$0")"

# Activate Python venv
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Python venv activated"
else
    echo "❌ Virtual environment not found. Run: python3 -m venv venv"
    exit 1
fi

# Start backend in background
echo "🚀 Starting FastAPI backend..."
uvicorn backend.app.main:app --reload &

# Save backend PID so we can stop it later
BACKEND_PID=$!

# Start frontend
echo "🚀 Starting React frontend..."
cd frontend
npm run dev

# When frontend exits, kill backend too
kill $BACKEND_PID
