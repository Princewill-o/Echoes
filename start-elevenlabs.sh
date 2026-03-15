#!/bin/bash

echo "🎵 Starting ElevenLabs Music Server..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local file found"
    echo "Creating from .env.local.example..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local - Please add your ELEVENLABS_API_KEY"
    echo ""
fi

# Load environment variables
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

cd ai-service

echo "🚀 Starting ElevenLabs Music Server on http://localhost:5000"
echo "📝 Generates music with vocals using ElevenLabs API"
echo ""

if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo "⚠️  No ELEVENLABS_API_KEY found in .env.local"
    echo "Running in DEMO MODE (instrumental only)"
    echo ""
    echo "To get real music with vocals:"
    echo "1. Sign up at https://elevenlabs.io"
    echo "2. Get your API key"
    echo "3. Add to .env.local: ELEVENLABS_API_KEY=your_key_here"
    echo ""
else
    echo "✅ ElevenLabs API key configured"
    echo "🎤 Will generate music with vocals and lyrics"
    echo ""
fi

python3 elevenlabs_music_server.py
