# Echoes Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js Frontend (Port 3000)              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │  Landing │  │  Create  │  │ Library  │            │ │
│  │  │   Page   │  │   Page   │  │   Page   │            │ │
│  │  └──────────┘  └──────────┘  └──────────┘            │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ /api/analyze-    │  │ /api/generate-   │               │
│  │     memory       │  │      song        │               │
│  └────────┬─────────┘  └────────┬─────────┘               │
│           │                     │                           │
│           │                     │                           │
└───────────┼─────────────────────┼───────────────────────────┘
            │                     │
            │                     │
            ▼                     ▼
┌─────────────────────┐  ┌─────────────────────────────────┐
│   GitHub AI API     │  │  MusicGen Service (Port 5000)   │
│   (GPT-4o Model)    │  │  ┌───────────────────────────┐  │
│                     │  │  │  Flask Server             │  │
│  - Lyrics Gen       │  │  │  - POST /generate         │  │
│  - Emotion Analysis │  │  │  - GET /health            │  │
│  - Genre Detection  │  │  └───────────────────────────┘  │
│                     │  │  ┌───────────────────────────┐  │
│  Fallback:          │  │  │  MusicGen AI Model        │  │
│  OpenAI API         │  │  │  - facebook/musicgen-small│  │
│                     │  │  │  - PyTorch + AudioCraft   │  │
└─────────────────────┘  │  └───────────────────────────┘  │
                         └─────────────────────────────────┘
                                      │
                                      │ Saves Audio
                                      ▼
                         ┌─────────────────────────────────┐
                         │   File System                   │
                         │   /public/audio/                │
                         │   - uuid.wav files              │
                         └─────────────────────────────────┘
```

## Data Flow

### 1. Memory to Lyrics

```
User Input (Memory)
    │
    ▼
POST /api/analyze-memory
    │
    ├─► GitHub AI (Primary)
    │   └─► GPT-4o Model
    │       └─► Returns: {title, lyrics, genre, mood, tempo, emotion}
    │
    └─► OpenAI (Fallback)
        └─► GPT-4o-mini
            └─► Returns: {title, lyrics, genre, mood, tempo, emotion}
```

### 2. Lyrics to Music

```
Confirmed Lyrics + Metadata
    │
    ▼
POST /api/generate-song
    │
    ▼
POST http://localhost:5000/generate
    │
    ▼
MusicGen AI Model
    │
    ├─► Load Model (first time only)
    ├─► Generate Audio (30 seconds)
    ├─► Save to /public/audio/uuid.wav
    │
    ▼
Returns: {audio_url, filename}
```

### 3. Complete Song Storage

```
Song Data
    │
    ├─► LocalStorage
    │   └─► echoes_songs array
    │       └─► {id, title, lyrics, audioUrl, metadata, date}
    │
    └─► File System
        └─► /public/audio/uuid.wav
```

## Component Architecture

### Frontend Components

```
app/
├── page.tsx (Landing)
│   ├── Sidebar Navigation
│   ├── Memory Input
│   ├── Quick Prompts
│   ├── Feature Grid
│   └── Recent Songs (from localStorage)
│
├── create/page.tsx (4-Stage Workflow)
│   ├── Stage 1: Analyzing
│   │   └── Progress Steps (4 steps)
│   ├── Stage 2: Lyrics Review
│   │   ├── Edit Mode
│   │   └── Preview Mode
│   ├── Stage 3: Generating Music
│   │   └── Progress Steps (4 steps)
│   └── Stage 4: Complete
│       ├── Audio Player
│       ├── Download Button
│       ├── Share Button
│       └── Lyrics Display
│
└── library/page.tsx
    ├── Song Grid
    ├── Empty State
    └── Song Cards
```

### API Routes

```
app/api/
├── analyze-memory/route.ts
│   ├── Validates input
│   ├── Calls GitHub AI / OpenAI
│   ├── Parses JSON response
│   └── Returns lyrics + metadata
│
├── generate-song/route.ts
│   ├── Builds music prompt
│   ├── Calls MusicGen service
│   ├── Handles errors
│   └── Returns audio URL
│
├── generate/route.ts (Legacy)
│   └── Combined flow
│
└── convert-to-mp3/route.ts
    ├── Checks for FFmpeg
    ├── Converts WAV to MP3
    └── Returns MP3 URL
```

## State Management

### React State (Create Page)

```typescript
stage: 'analyzing' | 'lyrics-review' | 'generating-music' | 'complete'
genStep: number (0-3)
lyricsData: {title, lyrics, genre, mood, tempo, emotion}
songData: {title, lyrics, audioUrl, metadata, date, id}
editedLyrics: string
isPlaying: boolean
audioElement: HTMLAudioElement | null
```

### LocalStorage Schema

```javascript
echoes_songs: [
  {
    id: timestamp,
    title: string,
    lyrics: string,
    memory: string,
    audioUrl: string,
    metadata: {
      genre: string,
      mood: string,
      tempo: string,
      emotion: string
    },
    date: string (YYYY-MM-DD),
    musicGenError?: boolean
  }
]
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **Audio:** HTML5 Audio API
- **Storage:** LocalStorage API
- **Sharing:** Web Share API

### Backend (Next.js)
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **HTTP Client:** Fetch API

### AI Services
- **Lyrics:** GitHub AI (GPT-4o) / OpenAI (GPT-4o-mini)
- **Music:** Meta MusicGen (PyTorch)

### Python Service
- **Framework:** Flask
- **CORS:** Flask-CORS
- **AI Model:** AudioCraft (MusicGen)
- **Audio Processing:** torchaudio
- **Deep Learning:** PyTorch

## Security Considerations

### API Keys
- Stored in `.env.local` (not committed)
- Server-side only (Next.js API routes)
- Never exposed to client

### File Storage
- Audio files in `/public/audio/`
- UUID filenames (no user data in names)
- Served statically by Next.js

### CORS
- MusicGen service allows localhost only
- Production: Configure allowed origins

## Performance Optimizations

### Frontend
- Lazy loading for images
- Audio preloading
- LocalStorage for instant library access
- Optimistic UI updates

### Backend
- Parallel API calls where possible
- Streaming responses (future)
- Caching (future)

### AI Models
- Model loaded once on startup
- Reused for all requests
- GPU acceleration (optional)

## Scalability Considerations

### Current (Local)
- Single user
- LocalStorage (limited to ~5-10MB)
- File system storage
- No authentication

### Future (Production)
- Multi-user support
- Database (PostgreSQL/MongoDB)
- Cloud storage (S3/R2)
- Authentication (NextAuth)
- Queue system (Redis/Bull)
- CDN for audio files
- Separate MusicGen server
- Load balancing

## Error Handling

### Graceful Degradation
1. GitHub AI fails → OpenAI fallback
2. OpenAI fails → Simple lyrics
3. MusicGen fails → Lyrics-only mode
4. Audio playback fails → Native controls

### User Feedback
- Loading states for all async operations
- Error messages with actionable steps
- Success confirmations
- Progress indicators

## Monitoring (Future)

- API response times
- MusicGen generation times
- Error rates
- User engagement metrics
- Storage usage
