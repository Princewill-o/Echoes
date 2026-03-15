#!/bin/bash

echo "🧪 Testing Echoes API Endpoints"
echo ""

# Test 1: Check MusicGen service
echo "1️⃣ Testing MusicGen service health..."
curl -s http://localhost:5000/health | jq '.' || echo "❌ MusicGen service not running"
echo ""

# Test 2: Analyze memory
echo "2️⃣ Testing memory analysis..."
curl -s -X POST http://localhost:3000/api/analyze-memory \
  -H "Content-Type: application/json" \
  -d '{"memory":"Late night drive after graduation"}' | jq '.title, .genre, .emotion'
echo ""

# Test 3: Check Next.js API
echo "3️⃣ Testing Next.js API health..."
curl -s http://localhost:3000/api/generate-song | jq '.'
echo ""

echo "✅ API tests complete!"
echo ""
echo "To run full generation test:"
echo "1. Start MusicGen: ./start-musicgen.sh"
echo "2. Start Next.js: npm run dev"
echo "3. Visit: http://localhost:3000"
