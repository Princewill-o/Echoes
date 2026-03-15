# MusicGen Local Music Generation Setup

This guide will help you set up local music generation using Meta's MusicGen AI model.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- 4GB+ RAM (8GB+ recommended)
- GPU optional (but recommended for faster generation)

## Installation Steps

### 1. Install Python Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

This will install:
- `torch` - PyTorch deep learning framework
- `torchaudio` - Audio processing
- `audiocraft` - Meta's MusicGen model
- `flask` - Web server
- `flask-cors` - CORS support

**Note:** First installation may take 5-10 minutes as it downloads the model (~1.5GB).

### 2. Start the MusicGen Service

```bash
python musicgen_server.py
```

You should see:
```
Loading MusicGen model...
Model loaded successfully!
Starting MusicGen server on http://localhost:5000
```

### 3. Start the Next.js App

In a new terminal:

```bash
npm run dev
```

The app will run on `http://localhost:3000`

## How It Works

### Architecture Flow

```
User enters memory
    ↓
Next.js frontend
    ↓
/api/analyze-memory (GitHub AI / OpenAI)
    ↓
Lyrics + Genre + Mood generated
    ↓
/api/generate-song
    ↓
Python MusicGen service (localhost:5000)
    ↓
Audio file generated (.wav)
    ↓
Saved to /public/audio/
    ↓
Returned to frontend
    ↓
Playable song!
```

### Generation Process

The app uses a 4-stage workflow:

#### Stage 1: Memory Analysis (3-4 seconds)
- User enters a memory
- GitHub AI / OpenAI analyzes the memory
- Generates:
  - Song title
  - Lyrics with [Verse], [Chorus], [Bridge] structure
  - Genre (indie, pop, rock, etc.)
  - Mood (nostalgic, happy, melancholic)
  - Tempo (slow, medium, fast)
  - Emotion tags

#### Stage 2: Lyrics Review
- User reviews generated lyrics
- Can edit lyrics directly in the interface
- Click "Generate Music" to proceed

#### Stage 3: Music Generation (5-10 seconds)
- MusicGen AI creates instrumental track
- 30-second duration (customizable)
- Matches the genre, mood, and tempo
- Saved as WAV file in `/public/audio/`

#### Stage 4: Complete
- Audio player with play/pause controls
- Download as WAV file
- Share song details
- View lyrics alongside music
- Save to personal library

## Model Options

Edit `ai-service/musicgen_server.py` line 10 to change models:

### musicgen-small (Default)
```python
model = MusicGen.get_pretrained("facebook/musicgen-small")
```
- Generation time: 6-10 seconds
- Quality: Good
- RAM: ~2GB
- Best for: Quick testing

### musicgen-medium
```python
model = MusicGen.get_pretrained("facebook/musicgen-medium")
```
- Generation time: 15-30 seconds
- Quality: Better
- RAM: ~4GB
- Best for: Production use

### musicgen-large
```python
model = MusicGen.get_pretrained("facebook/musicgen-large")
```
- Generation time: 40-60 seconds
- Quality: Best
- RAM: ~8GB
- GPU: Highly recommended
- Best for: High-quality output

## Optional: MP3 Conversion

By default, MusicGen generates WAV files. To enable MP3 downloads:

### Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Usage

The app includes an API endpoint `/api/convert-to-mp3` that automatically converts WAV to MP3 when needed. No additional configuration required once FFmpeg is installed.

## Customization

### Change Generation Duration

Edit line 11 in `musicgen_server.py`:

```python
model.set_generation_params(duration=30)  # Change to 15, 45, 60, etc.
```

### Adjust Prompt Format

Edit `app/api/generate-song/route.ts` to customize the music prompt:

```typescript
const prompt = `${genre} music, ${mood} emotional vibe, ${tempo} tempo, cinematic soundtrack, instrumental`
```

Try adding:
- Specific instruments: "with piano and strings"
- Style descriptors: "ambient", "upbeat", "dramatic"
- Reference artists: "in the style of Hans Zimmer"

## Troubleshooting

### MusicGen service won't start

**Error:** `ModuleNotFoundError: No module named 'audiocraft'`

**Solution:**
```bash
cd ai-service
pip install --upgrade pip
pip install -r requirements.txt
```

### Out of memory errors

**Solution:** Switch to `musicgen-small` model or close other applications.

### Audio not playing

**Check:**
1. MusicGen service is running on port 5000
2. Check browser console for errors
3. Verify files exist in `/public/audio/`
4. Try a different browser

### Slow generation

**Solutions:**
- Use `musicgen-small` model
- Reduce duration to 15-20 seconds
- Use a GPU if available
- Close other applications

## API Endpoints

### MusicGen Service (Port 5000)

#### POST /generate
Generate music from text prompt.

**Request:**
```json
{
  "prompt": "indie pop music, nostalgic mood, slow tempo, cinematic"
}
```

**Response:**
```json
{
  "audio_url": "/audio/uuid.wav",
  "filename": "uuid.wav"
}
```

#### GET /health
Check service status.

**Response:**
```json
{
  "status": "ok",
  "model": "musicgen-small"
}
```

### Next.js API Routes

#### POST /api/analyze-memory
Analyze memory and generate lyrics.

#### POST /api/generate-song
Generate music with MusicGen.

#### POST /api/generate
Complete flow (analysis + generation).

## Performance Tips

1. **First run is slow** - Model downloads on first use (~1.5GB)
2. **GPU acceleration** - Install CUDA for 3-5x faster generation
3. **Batch generation** - Generate multiple songs in sequence
4. **Cache models** - Models are cached after first download

## Production Deployment

For production, consider:

1. **Separate server** - Run MusicGen on dedicated server
2. **Queue system** - Use Redis/Bull for job queue
3. **Cloud storage** - Store audio in S3/CloudFlare R2
4. **CDN** - Serve audio files via CDN
5. **GPU instances** - Use AWS/GCP GPU instances

## Alternative: Keep Suno API

If you prefer the Suno API (cloud-based):

1. Keep the existing `.env.local` with `SUNO_API_KEY`
2. The app will automatically fall back to Suno if MusicGen is unavailable
3. Suno generates vocals + lyrics, MusicGen is instrumental only

## Resources

- [MusicGen GitHub](https://github.com/facebookresearch/audiocraft)
- [MusicGen Paper](https://arxiv.org/abs/2306.05284)
- [AudioCraft Documentation](https://facebookresearch.github.io/audiocraft/)

## Support

If you encounter issues:
1. Check the terminal logs for both services
2. Verify Python version: `python --version`
3. Check disk space (models need ~2GB)
4. Review browser console for frontend errors
