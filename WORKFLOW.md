# Echoes - Complete Workflow Guide

## User Journey

### 1. Landing Page
- User enters a memory in the text input
- Can use quick prompts or voice input (mic button)
- Clicks "Create My Song"

### 2. Stage 1: Memory Analysis (3-4 seconds)
**What happens:**
- Memory sent to `/api/analyze-memory`
- GitHub AI (GPT-4o) or OpenAI analyzes the memory
- Generates song metadata and lyrics

**User sees:**
- Animated loading screen with progress steps
- "Analyzing memory emotion"
- "Identifying music genre"
- "Crafting song structure"
- "Writing lyrics"

**Output:**
```json
{
  "title": "Midnight Roads",
  "genre": "indie pop",
  "mood": "nostalgic",
  "tempo": "slow",
  "emotion": "bittersweet",
  "lyrics": "[Verse]\n...\n[Chorus]\n..."
}
```

### 3. Stage 2: Lyrics Review
**What happens:**
- User sees generated lyrics
- Can edit lyrics directly in textarea
- Reviews song title and metadata tags

**User actions:**
- Click "Edit" to modify lyrics
- Click "Generate Music" to proceed
- Click "Cancel" to go back

### 4. Stage 3: Music Generation (5-10 seconds)
**What happens:**
- Lyrics sent to `/api/generate-song`
- MusicGen AI creates instrumental track
- Audio saved to `/public/audio/`

**User sees:**
- Animated loading screen with music generation steps
- "Preparing MusicGen AI"
- "Composing melody"
- "Adding harmonies"
- "Finalizing audio"

**Output:**
```json
{
  "audio_url": "/audio/uuid.wav",
  "filename": "uuid.wav"
}
```

### 5. Stage 4: Song Complete
**What user sees:**
- Album art placeholder with song title
- Audio player with play/pause controls
- Full lyrics display
- Metadata tags (genre, emotion, tempo, mood)

**User actions:**
- **Play** - Listen to the generated music
- **Download** - Save as WAV file
- **Share** - Share via native share or copy to clipboard
- **View Library** - See all created songs
- **Create Another** - Start over

**Song saved to:**
- LocalStorage: `echoes_songs` array
- File system: `/public/audio/uuid.wav`

## Technical Flow

```
┌─────────────────┐
│  User Memory    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  POST /api/analyze-memory   │
│  - GitHub AI (GPT-4o)       │
│  - Analyzes emotion         │
│  - Generates lyrics         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Lyrics Review Screen       │
│  - User can edit            │
│  - Confirm to proceed       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  POST /api/generate-song    │
│  - Calls MusicGen service   │
│  - localhost:5000/generate  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MusicGen AI (Python)       │
│  - Generates 30s audio      │
│  - Saves to /public/audio/  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Complete Screen            │
│  - Play audio               │
│  - Download/Share           │
│  - Save to library          │
└─────────────────────────────┘
```

## API Endpoints

### POST /api/analyze-memory
**Request:**
```json
{
  "memory": "Late night drive after graduation"
}
```

**Response:**
```json
{
  "title": "Midnight Roads",
  "genre": "indie pop",
  "mood": "nostalgic",
  "tempo": "slow",
  "emotion": "bittersweet",
  "lyrics": "[Verse]\nStreetlights flicker..."
}
```

### POST /api/generate-song
**Request:**
```json
{
  "lyrics": "[Verse]...",
  "genre": "indie pop",
  "mood": "nostalgic",
  "tempo": "slow"
}
```

**Response:**
```json
{
  "audio_url": "/audio/abc123.wav",
  "filename": "abc123.wav",
  "prompt": "indie pop music, nostalgic vibe, slow tempo, cinematic"
}
```

### POST http://localhost:5000/generate (MusicGen Service)
**Request:**
```json
{
  "prompt": "indie pop music, nostalgic vibe, slow tempo, cinematic"
}
```

**Response:**
```json
{
  "audio_url": "/audio/abc123.wav",
  "filename": "abc123.wav"
}
```

## Data Storage

### LocalStorage Schema
```javascript
echoes_songs: [
  {
    id: 1234567890,
    title: "Midnight Roads",
    lyrics: "[Verse]...",
    memory: "Late night drive after graduation",
    audioUrl: "/audio/abc123.wav",
    metadata: {
      genre: "indie pop",
      mood: "nostalgic",
      tempo: "slow",
      emotion: "bittersweet"
    },
    date: "2026-03-15",
    musicGenError: false
  }
]
```

## Features

### Play/Pause
- HTML5 Audio API
- State managed in React
- Auto-pause on song end

### Download
- Creates temporary `<a>` element
- Downloads WAV file directly
- Filename: `Song_Title.wav`

### Share
- Uses Web Share API if available
- Fallback: Copy to clipboard
- Shares: Title, Memory, URL

### Edit Lyrics
- Toggle between preview and edit mode
- Textarea with monospace font
- Changes saved before music generation

## Error Handling

### MusicGen Service Unavailable
- Shows amber warning message
- Saves lyrics-only version
- Provides setup instructions
- User can still view/edit lyrics

### GitHub AI / OpenAI Unavailable
- Falls back to simple lyrics
- Uses memory text as base
- Still allows music generation

### Audio Playback Issues
- Browser compatibility check
- Fallback to native controls
- Error messages for unsupported formats

## Performance

### Timing
- Memory analysis: 3-4 seconds
- Lyrics review: User-controlled
- Music generation: 5-10 seconds (small model)
- Total: ~15-20 seconds

### Optimization
- Parallel API calls where possible
- LocalStorage for instant library access
- Audio preloading
- Lazy loading for images

## Future Enhancements

1. **Vocals** - Add AI singing voice (ElevenLabs)
2. **Album Art** - Generate custom cover art (Stable Diffusion)
3. **Multiple Versions** - Generate variations (hopeful, sad, upbeat)
4. **Cloud Storage** - Save to database instead of localStorage
5. **Social Features** - Share publicly, like/comment
6. **Playlists** - Organize songs into collections
7. **Export** - Batch download, create mixtapes
