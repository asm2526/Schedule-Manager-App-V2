#!/bin/bash

# Always run from project root
cd "$(dirname "$0")"

echo "🔄 Restarting services..."

# Stop FastAPI + Mongo
./stop.sh

# Small pause to let processes stop
sleep 2

# Start FastAPI + Mongo
./run.sh
