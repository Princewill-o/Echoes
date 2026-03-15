# MusicGen AI Service

Local music generation service using Meta's MusicGen model.

## Setup

1. Install Python dependencies:
```bash
cd ai-service
pip install -r requirements.txt
```

2. Start the server:
```bash
python musicgen_server.py
```

The server will run on `http://localhost:5000`

## API Endpoints

### POST /generate
Generate music from a text prompt.

**Request:**
```json
{
  "prompt": "cinematic emotional indie music, nostalgic mood, soft piano"
}
```

**Response:**
```json
{
  "audio_url": "/audio/uuid.wav",
  "filename": "uuid.wav"
}
```

### GET /health
Check if the service is running.

## Models

- `musicgen-small` - Fast, 6-10 seconds (default)
- `musicgen-medium` - Better quality, 15-30 seconds
- `musicgen-large` - Best quality, 40-60 seconds (requires GPU)

To change model, edit line 10 in `musicgen_server.py`:
```python
model = MusicGen.get_pretrained("facebook/musicgen-medium")
```

## Notes

- Audio files are saved to `../public/audio/`
- Default generation duration: 30 seconds
- Requires ~2GB RAM for small model
- GPU recommended for medium/large models
