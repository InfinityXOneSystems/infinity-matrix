#!/bin/bash

# Development startup script

set -e

echo "🚀 Starting Lead Generation Pipeline in Development Mode"
echo "========================================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run: bash scripts/setup.sh"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure it"
    exit 1
fi

# Start backend server
echo "🔧 Starting backend server..."
echo "API will be available at: http://localhost:8000"
echo "Documentation: http://localhost:8000/docs"
echo ""

# Run with auto-reload
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
