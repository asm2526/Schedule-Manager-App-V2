#!/bin/bash

# always run from project root
cd "$(dirname "$0")"

# activate venv
if [ -d "venv" ]; then
    source venv/bin/activate
else
    echo " Virtual environment not found. "
    exit 1
fi

# start fastAPI with uvicorn
uvicorn backend.app.main:app --reload
