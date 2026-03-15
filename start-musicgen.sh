#!/bin/bash

echo "🎵 Starting MusicGen AI Service..."
echo ""
echo "This will:"
echo "1. Check Python installation"
echo "2. Install dependencies if needed"
echo "3. Start the MusicGen server on port 5000"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Navigate to ai-service directory
cd ai-service

# Check if requirements are installed
echo "📦 Checking dependencies..."
if ! python3 -c "import audiocraft" 2>/dev/null; then
    echo "Installing Python dependencies (this may take 5-10 minutes on first run)..."
    pip3 install -r requirements.txt
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting MusicGen server..."
echo "Server will run on http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 musicgen_server.py
