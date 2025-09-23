#!/bin/bash

# Always run from project root
cd "$(dirname "$0")"

echo "🚀 Starting Schedule Manager"

# --- Activate Python venv ---
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Python venv activated"
else
    echo "❌ Virtual environment not found. Run: python3 -m venv venv"
    exit 1
fi

# --- Start Backend ---
echo "🚀 Starting FastAPI backend on http://0.0.0.0:8000"
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# --- Start Expo Mobile ---
echo "🚀 Starting Expo (scan QR code with Expo Go app)"
cd mobile
npx expo start

# --- Cleanup on exit ---
kill $BACKEND_PID
