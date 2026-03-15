# Fooocus Setup for Album Cover Generation

Fooocus is an AI image generator that creates beautiful album artwork for your songs.

## Installation

### 1. Clone Fooocus Repository

```bash
cd ~/Downloads  # or wherever you want to install it
git clone https://github.com/lllyasviel/Fooocus.git
cd Fooocus
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

Or if you have Python 3.13 issues:

```bash
pip3 install -r requirements.txt
```

### 3. Run Fooocus with API Mode

```bash
python entry_with_update.py --api
```

Or:

```bash
python3 entry_with_update.py --api
```

The API will run on: `http://127.0.0.1:7865`

## Testing the API

Test if Fooocus is working:

```bash
curl http://127.0.0.1:7865/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "cinematic indie album cover, sunset over city, nostalgic mood, 4k",
    "negative_prompt": "low quality, blurry",
    "aspect_ratio": "1:1"
  }'
```

## How It Works in Echoes

1. User enters a memory
2. AI generates lyrics with genre/mood/emotion
3. **Fooocus generates custom album cover** based on:
   - The memory
   - Genre (indie, pop, rock, etc.)
   - Mood (nostalgic, melancholic, euphoric)
   - Emotion (joy, longing, wonder)
4. MusicGen creates the audio
5. Complete song with custom artwork is ready!

## Example Prompts

### Memory: "Watching sunset from rooftop with best friend"
**Generated Prompt:**
```
cinematic music album cover, indie pop music artwork, nostalgic and euphoric atmosphere, 
joy and connection feeling, inspired by: watching sunset from rooftop with best friend, 
dramatic lighting, professional music cover art, high detail, 4k, vinyl cover aesthetic
```

### Memory: "Leaving hometown, watching it disappear"
**Generated Prompt:**
```
cinematic music album cover, indie folk music artwork, bittersweet atmosphere, 
longing feeling, inspired by: leaving hometown in rearview mirror, 
dramatic lighting, professional music cover art, high detail, 4k
```

## Troubleshooting

### Fooocus not running?
Make sure you started it with `--api` flag:
```bash
python entry_with_update.py --api
```

### Port already in use?
Change the port:
```bash
python entry_with_update.py --api --port 7866
```

Then update `app/api/generate-cover/route.ts` to use port 7866.

### Python version issues?
Fooocus works best with Python 3.10 or 3.11 (same as MusicGen).

## Without Fooocus

If you don't have Fooocus installed, the app will:
- Use a beautiful gradient fallback cover
- Still show the song title and music icon
- Everything else works normally

## Performance

- First generation: ~30-60 seconds (downloads models)
- Subsequent generations: ~10-20 seconds
- GPU recommended for faster generation
- CPU works but slower

## API Endpoints

### Generate Cover
```
POST /api/generate-cover
Body: { memory, genre, mood, emotion, title }
Returns: { cover_url, prompt }
```

### Health Check
```
GET /api/generate-cover
Returns: { status, fooocus }
```
