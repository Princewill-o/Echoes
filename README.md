# Echoes 🎵

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Princewill-o/Echoes)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://echoes-princewill-o.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue)](https://github.com/Princewill-o/Echoes)

> Turn your memories into cinematic songs with AI

**🏆 Hackathon Project 2026**

[Live Demo](https://echoes-princewill-o.vercel.app) | [GitHub Repo](https://github.com/Princewill-o/Echoes) | [Setup Guide](VERCEL_SETUP.md)

## Features

- � Memory to Music - Describe a moment, get a full song
- 🎼 AI Lyrics Generation - GitHub AI or OpenAI creates emotional lyrics
- � Local Music Generation - MusicGen creates instrumental soundtracks
- 🎨 AI Album Covers - Fooocus generates custom artwork for each song
- 🎨 Beautiful UI - Cinematic design with dark/light mode
- 📚 Personal Library - Save and replay your memory songs
- 🎧 Audio Playback - Listen to your generated songs

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```bash
# GitHub AI (Free - Recommended)
GITHUB_TOKEN=your_github_token_here

# OpenAI (Optional - Fallback)
OPENAI_API_KEY=your_openai_key_here
```

### 3. Start MusicGen Service (Optional but Recommended)

For local music generation:

**macOS/Linux:**
```bash
./start-musicgen.sh
```

**Windows:**
```bash
start-musicgen.bat
```

Or manually:
```bash
cd ai-service
pip install -r requirements.txt
python musicgen_server.py
```

The MusicGen service will run on `http://localhost:5000`

### 4. Start the Next.js App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

### 4-Stage Workflow

1. **Enter a Memory** - Type or speak a personal moment
2. **Review Lyrics** - AI generates lyrics, you can edit them
3. **Generate Music** - MusicGen creates instrumental soundtrack
4. **Play & Share** - Listen, download, and share your song

See [WORKFLOW.md](./WORKFLOW.md) for detailed flow documentation.

## Architecture

```
User Memory
    ↓
GitHub AI / OpenAI → Lyrics + Metadata
    ↓
MusicGen (Python) → Audio Generation
    ↓
Next.js Frontend → Playback & Library
```

## Tech Stack

- **Frontend:** Next.js 14, React, TailwindCSS
- **AI Lyrics:** GitHub AI (GPT-4o) or OpenAI
- **Music Generation:** Meta MusicGen (Python)
- **Album Artwork:** Fooocus AI Image Generation
- **Storage:** LocalStorage (songs), File System (audio/covers)

## MusicGen Setup

See [MUSICGEN_SETUP.md](./MUSICGEN_SETUP.md) for detailed instructions.

## Fooocus Setup (Album Covers)

See [FOOOCUS_SETUP.md](./FOOOCUS_SETUP.md) for detailed instructions.

**Quick Start:**
```bash
git clone https://github.com/lllyasviel/Fooocus.git
cd Fooocus
pip install -r requirements.txt
python entry_with_update.py --api
```

The Fooocus API will run on `http://127.0.0.1:7865`

**Requirements:**
- Python 3.8+
- 4GB+ RAM
- ~2GB disk space for model

**Models:**
- `musicgen-small` - Fast (6-10s), Good quality
- `musicgen-medium` - Balanced (15-30s), Better quality
- `musicgen-large` - Slow (40-60s), Best quality (GPU recommended)

## Project Structure

```
echoes/
├── app/
│   ├── api/
│   │   ├── analyze-memory/    # Lyrics generation
│   │   ├── generate-song/     # Music generation
│   │   └── generate/          # Complete flow
│   ├── create/                # Song creation page
│   ├── library/               # Song library page
│   └── page.tsx               # Landing page
├── ai-service/
│   ├── musicgen_server.py     # MusicGen API server
│   └── requirements.txt       # Python dependencies
├── public/
│   └── audio/                 # Generated audio files
└── .env.local                 # API keys
```

## API Endpoints

### Next.js Routes

- `POST /api/analyze-memory` - Generate lyrics from memory
- `POST /api/generate-song` - Generate music with MusicGen
- `POST /api/generate` - Complete generation flow

### MusicGen Service

- `POST http://localhost:5000/generate` - Generate audio
- `GET http://localhost:5000/health` - Service status

## Configuration

### Change Music Duration

Edit `ai-service/musicgen_server.py`:

```python
model.set_generation_params(duration=30)  # Change to 15, 45, 60
```

### Switch MusicGen Model

Edit `ai-service/musicgen_server.py`:

```python
model = MusicGen.get_pretrained("facebook/musicgen-medium")
```

### Customize Music Prompts

Edit `app/api/generate-song/route.ts`:

```typescript
const prompt = `${genre} music, ${mood} vibe, ${tempo} tempo, cinematic`
```

## Troubleshooting

### MusicGen not working

1. Check if service is running: `http://localhost:5000/health`
2. Verify Python dependencies: `pip install -r requirements.txt`
3. Check terminal logs for errors

### No audio playing

1. Ensure MusicGen service is running
2. Check `/public/audio/` for generated files
3. Try a different browser

### Out of memory

1. Switch to `musicgen-small` model
2. Reduce generation duration
3. Close other applications

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT

## Credits

- **MusicGen** by Meta AI
- **GitHub Models** for free AI inference
- **Next.js** by Vercel
- **TailwindCSS** for styling
