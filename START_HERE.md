# 🚀 START HERE - Complete Setup Guide

## Quick Setup (5 minutes)

### Step 1: Install Node Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Create `.env.local` file in the root directory:
```bash
GITHUB_TOKEN=your_github_token_here
```

Get your GitHub token from: https://github.com/settings/tokens

### Step 3: Install Python Dependencies
```bash
cd ai-service
pip3 install -r requirements.txt
cd ..
```

**Note:** First install will download ~1.5GB MusicGen model. This is normal.

### Step 4: Start Both Services

**Terminal 1 - MusicGen Service:**
```bash
./start-musicgen.sh
```

Wait for: `Model loaded successfully!` and `Running on http://localhost:5000`

**Terminal 2 - Next.js App:**
```bash
npm run dev
```

Wait for: `Ready on http://localhost:3000`

### Step 5: Test the App

Visit: http://localhost:3000/test

This test page will verify:
1. ✅ MusicGen service is running
2. ✅ Lyrics generation works
3. ✅ Music generation works

### Step 6: Create Your First Song!

Visit: http://localhost:3000

1. Enter a memory (e.g., "Late night drive after graduation")
2. Click "Create My Song"
3. Wait for lyrics to generate (~3 seconds)
4. Review and edit lyrics if needed
5. Click "Generate Music"
6. Wait for music to generate (~10 seconds)
7. Play, download, or share your song!

## Troubleshooting

### MusicGen Service Won't Start

**Error: `ModuleNotFoundError: No module named 'audiocraft'`**

Solution:
```bash
cd ai-service
pip3 install --upgrade pip
pip3 install torch torchaudio audiocraft flask flask-cors
```

**Error: `Address already in use`**

Port 5000 is taken. Kill the process:
```bash
lsof -ti:5000 | xargs kill -9
```

### Lyrics Not Generating

**Check browser console (F12) for errors**

Common issues:
1. GITHUB_TOKEN not set in `.env.local`
2. GitHub API rate limit reached
3. Network connection issues

Solution: The app will use fallback lyrics if AI fails.

### Music Not Generating

**Check Terminal 1 (MusicGen) for errors**

Common issues:
1. MusicGen service not running
2. Out of memory (need 4GB+ RAM)
3. Model not downloaded

Test MusicGen directly:
```bash
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"indie pop music, nostalgic mood"}'
```

Should return: `{"audio_url": "/audio/uuid.wav", "filename": "uuid.wav"}`

### Audio Not Playing

1. Check if file exists: `ls public/audio/`
2. Try different browser (Chrome/Firefox recommended)
3. Check browser console for errors
4. Verify audio format support

## System Requirements

### Minimum
- Node.js 18+
- Python 3.8+
- 4GB RAM
- 2GB disk space

### Recommended
- Node.js 20+
- Python 3.10+
- 8GB RAM
- GPU (for faster generation)
- 5GB disk space

## Architecture Overview

```
┌─────────────────────────────────────────┐
│  Browser (localhost:3000)               │
│  - Landing Page                         │
│  - Create Page (4 stages)               │
│  - Library Page                         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Next.js API Routes                     │
│  - /api/analyze-memory                  │
│  - /api/generate-song                   │
└──────────────┬──────────────────────────┘
               │
               ├──► GitHub AI (Lyrics)
               │
               └──► MusicGen Service
                    (localhost:5000)
                    │
                    ▼
                    Audio Files
                    (/public/audio/)
```

## File Structure

```
echoes/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/page.tsx       # 4-stage creation flow
│   ├── library/page.tsx      # Song library
│   ├── test/page.tsx         # API test page
│   └── api/
│       ├── analyze-memory/   # Lyrics generation
│       └── generate-song/    # Music generation
├── ai-service/
│   ├── musicgen_server.py    # Python Flask server
│   └── requirements.txt      # Python dependencies
├── public/audio/             # Generated audio files
├── .env.local                # API keys (create this)
└── start-musicgen.sh         # Helper script
```

## Common Commands

```bash
# Start MusicGen
./start-musicgen.sh

# Start Next.js
npm run dev

# Test APIs
open http://localhost:3000/test

# Check MusicGen health
curl http://localhost:5000/health

# View generated audio files
ls -lh public/audio/

# Clear generated audio
rm public/audio/*.wav

# Restart everything
# Ctrl+C in both terminals, then restart
```

## Next Steps

1. ✅ Complete setup above
2. ✅ Test at http://localhost:3000/test
3. ✅ Create your first song
4. 📖 Read [WORKFLOW.md](./WORKFLOW.md) for detailed flow
5. ⚙️ Read [MUSICGEN_SETUP.md](./MUSICGEN_SETUP.md) for customization
6. 🏗️ Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

## Getting Help

1. Check browser console (F12)
2. Check Terminal 1 (MusicGen logs)
3. Check Terminal 2 (Next.js logs)
4. Visit test page: http://localhost:3000/test
5. Review documentation in this repo

## Success Checklist

- [ ] Node dependencies installed
- [ ] Python dependencies installed
- [ ] `.env.local` created with GITHUB_TOKEN
- [ ] MusicGen service starts without errors
- [ ] Next.js app starts without errors
- [ ] Test page shows all green checks
- [ ] Created first song successfully
- [ ] Audio plays in browser
- [ ] Song saved to library

## You're Ready! 🎉

Once all checks pass, you're ready to turn memories into music!

Visit: **http://localhost:3000**

Happy music making! 🎵
