#!/bin/bash

# always run from project root
cd "$(dirname "$0")"

echo "Stopping fastapi server..."

#kill uvicorn processes
pikill -f "uvicorn backend.app.map:app --reload"

echo "Stopping mongodb service..."
brew services stop mongodb-community@6.0

echo "All services stopped."