#!/bin/bash

echo "🎨 Starting Fooocus Album Cover Generator..."
echo ""

# Check if Fooocus directory exists
if [ ! -d "../Fooocus" ] && [ ! -d "~/Fooocus" ]; then
    echo "❌ Fooocus not found!"
    echo ""
    echo "Please install Fooocus first:"
    echo "  git clone https://github.com/lllyasviel/Fooocus.git"
    echo "  cd Fooocus"
    echo "  pip install -r requirements.txt"
    echo ""
    exit 1
fi

# Try to find Fooocus
if [ -d "../Fooocus" ]; then
    cd ../Fooocus
elif [ -d "~/Fooocus" ]; then
    cd ~/Fooocus
fi

echo "📂 Found Fooocus directory"
echo "🚀 Starting Fooocus API server..."
echo ""
echo "This will:"
echo "  - Download AI models (first time only)"
echo "  - Start API server on http://127.0.0.1:7865"
echo "  - Generate album covers for your songs"
echo ""

python entry_with_update.py --api
