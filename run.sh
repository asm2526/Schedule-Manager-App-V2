#!/bin/bash

# always run from project root
cd "$(dirname "$0")"

# start mongodb
echo "Checking mongodb service..."
if brew services list | grep -q "mongodb-community@6.0.*started"; then
    echo "Mongo db is alread running"
else
    echo " starting mongodb"
    brew services start mongodb-community@6.0
fi 

# activate venv
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo " Virtual environment not found. "
    exit 1
fi

# start fastAPI with uvicorn
uvicorn backend.app.main:app --reload
