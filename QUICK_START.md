# Quick Start Guide

## Setup (5 minutes)

### 1. Install Node Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```bash
GITHUB_TOKEN=your_github_token_here
```

### 3. Install Python Dependencies
```bash
cd ai-service
pip install -r requirements.txt
```

### 4. Start Services

**Terminal 1 - MusicGen:**
```bash
./start-musicgen.sh
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

### 5. Open App
Visit: http://localhost:3000

## Usage

1. Enter a memory (e.g., "Late night drive after graduation")
2. Click "Create My Song"
3. Review and edit generated lyrics
4. Click "Generate Music"
5. Play, download, or share your song!

## Troubleshooting

**MusicGen not working?**
- Check if Python service is running on port 5000
- Run: `curl http://localhost:5000/health`

**No lyrics generated?**
- Verify GITHUB_TOKEN in `.env.local`
- Check browser console for errors

**Audio not playing?**
- Ensure MusicGen service is running
- Check `/public/audio/` for generated files

## Documentation

- [README.md](./README.md) - Full project overview
- [WORKFLOW.md](./WORKFLOW.md) - Detailed user journey
- [MUSICGEN_SETUP.md](./MUSICGEN_SETUP.md) - MusicGen configuration

## Support

Issues? Check the logs:
- Next.js: Terminal 2
- MusicGen: Terminal 1
- Browser: DevTools Console
