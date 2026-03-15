# ElevenLabs Music Integration

Your Echoes app now uses **ElevenLabs Music API** - the same technology powering Mozart AI!

## What is ElevenLabs Music?

ElevenLabs Music is a state-of-the-art Text-to-Music model that generates:
- ✅ **Music with VOCALS** (actual singing!)
- ✅ **Lyrics integration** (sings your AI-generated lyrics)
- ✅ **60-second songs** (3 seconds to 5 minutes supported)
- ✅ **Any genre** (indie, pop, rock, electronic, etc.)
- ✅ **Studio-grade quality** (MP3 44.1kHz, 128-192kbps)
- ✅ **Commercial use** (cleared for most commercial uses)

## Setup

### 1. Get an ElevenLabs API Key

1. Go to https://elevenlabs.io
2. Sign up for an account
3. Navigate to your profile settings
4. Copy your API key

### 2. Add to Environment Variables

Add to your `.env.local` file:

```bash
ELEVENLABS_API_KEY=your_api_key_here
```

### 3. Start the Server

```bash
./start-elevenlabs.sh
```

Or manually:

```bash
cd ai-service
python3 elevenlabs_music_server.py
```

## How It Works

### Complete Flow

```
User Memory
    ↓
GitHub AI generates lyrics
    ↓
ElevenLabs Music API
    ├─ Receives: Genre, mood, tempo, lyrics
    ├─ Generates: 60-second song with vocals
    └─ Returns: MP3 audio file
    ↓
Song with singing vocals!
```

### What Gets Sent to ElevenLabs

```json
{
  "prompt": "indie pop music, nostalgic emotional vibe, medium tempo, cinematic soundtrack with vocals\n\nLyrics:\n[Verse 1]\nWe climbed the stairs...",
  "music_length_ms": 60000,
  "model_id": "music_v1"
}
```

## Demo Mode (No API Key)

Without an API key, the app runs in demo mode:
- Creates 60-second instrumental music
- No vocals (instrumental only)
- Still matches mood and genre
- Perfect for testing the workflow

## With API Key

With an ElevenLabs API key:
- ✅ Real AI-generated music
- ✅ Actual singing vocals
- ✅ Sings your lyrics
- ✅ Studio-quality audio
- ✅ Professional production

## Pricing

ElevenLabs offers various plans:
- **Free Tier**: Limited generations per month
- **Starter**: More generations
- **Creator**: Higher quality (192kbps MP3)
- **Pro**: PCM 44.1kHz, more generations
- **Enterprise**: Custom solutions

Check https://elevenlabs.io/pricing for current pricing.

## Features

### Supported

- ✅ Text-to-music generation
- ✅ Lyrics integration
- ✅ Genre control
- ✅ Mood/emotion control
- ✅ Duration control (3s - 5min)
- ✅ Multilingual (English, Spanish, German, Japanese, etc.)
- ✅ MP3 and WAV formats

### Advanced (Enterprise)

- Music Finetunes (train on your own style)
- Stem separation (isolate vocals, drums, etc.)
- Inpainting (edit specific sections)
- C2PA signing (content authenticity)

## Example Output

### Memory
"I watched the sunset from my rooftop with my best friend, laughing until our stomachs hurt"

### Generated Song
- **Title**: "Rooftops and Sunsets"
- **Genre**: Indie Pop
- **Duration**: 60 seconds
- **Vocals**: YES! Actual singing
- **Lyrics**: Full verse, chorus, bridge structure
- **Quality**: Studio-grade MP3

## Comparison

### Before (MusicGen/Simple Server)
- ❌ Instrumental only
- ❌ No vocals
- ❌ Simple melodies
- ✅ Free/local

### After (ElevenLabs)
- ✅ Full vocals with singing
- ✅ Professional production
- ✅ Sings your lyrics
- ✅ Studio quality
- 💰 Requires API key

## Troubleshooting

### "API Key configured: No"
Add `ELEVENLABS_API_KEY` to `.env.local`

### "ElevenLabs API error: 401"
Your API key is invalid. Check it at https://elevenlabs.io

### "ElevenLabs API error: 429"
You've hit your rate limit. Upgrade your plan or wait.

### "Demo mode"
This is normal without an API key. Add one for real music.

## Commercial Use

ElevenLabs Music is cleared for:
- ✅ Film and television
- ✅ Podcasts
- ✅ Social media videos
- ✅ Advertisements
- ✅ Gaming
- ✅ Most commercial uses

Check their terms for specific usage rights on your plan.

## Resources

- Website: https://elevenlabs.io
- API Docs: https://elevenlabs.io/docs/api-reference/music/compose
- Pricing: https://elevenlabs.io/pricing
- Mozart AI (built on ElevenLabs): https://elevenlabs.io/blog/mozart-ai

## Summary

Your Echoes app now uses the same technology as Mozart AI! With an ElevenLabs API key, you get:

1. Real AI-generated music
2. Actual singing vocals
3. Lyrics sung by AI
4. Studio-quality production
5. 60-second complete songs

Without an API key, it falls back to demo instrumental music so you can still test everything.
