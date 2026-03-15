# Custom Song Setup - "Menace in the Hallways"

## Overview
When a user enters the specific secondary school memory, the system will automatically use your custom lyrics, MP3 file, and album art.

## Required Files

### 1. Audio File
**Location:** `public/audio/menace-song.mp3`
- Your custom recorded song
- Will be played instead of AI-generated music

### 2. Album Art
**Location:** `public/audio/menace.png`
- Your custom album cover image
- Will be displayed instead of AI-generated cover

## How It Works

### Trigger Memory
When a user enters this memory on the main page:
```
"back in secondary school the funniest time of my life where i used to be silly, cause havoc and be a menace"
```

### Automatic Detection
The system checks for these keywords:
- "secondary school"
- "funniest"
- "menace" OR "havoc" OR "silly"

### What Happens
1. **Lyrics Generation** (`/api/analyze-memory`)
   - Returns your pre-written "Menace in the Hallways" lyrics
   - No AI generation needed

2. **Music Generation** (`/api/generate-song`)
   - Returns path to your custom MP3: `/audio/menace-song.mp3`
   - Skips AI music generation

3. **Album Cover** (`app/create/page.tsx`)
   - Uses your custom image: `/audio/menace.png`
   - Skips AI cover generation

## Testing

### Step 1: Add Files
1. Place `menace-song.mp3` in `public/audio/`
2. Place `menace.png` in `public/audio/`

### Step 2: Test the Flow
1. Go to http://localhost:3000
2. Enter the memory: "back in secondary school the funniest time of my life where i used to be silly, cause havoc and be a menace"
3. Click "Generate Lyrics"
4. Verify the custom lyrics appear
5. Click "Generate Music"
6. Verify your custom MP3 plays
7. Verify your custom album art displays

## Expected Result
- Title: "Menace in the Hallways"
- Lyrics: Your pre-written lyrics (with verses, chorus, bridge)
- Audio: Your custom MP3 file
- Cover: Your custom PNG image
- Genre: indie pop
- Mood: nostalgic and playful

## File Locations Summary
```
public/
  audio/
    menace-song.mp3  ← Your custom audio
    menace.png       ← Your custom album art
```

## Code Files Modified
- `app/api/analyze-memory/route.ts` - Custom lyrics detection
- `app/api/generate-song/route.ts` - Custom audio detection
- `app/create/page.tsx` - Custom cover detection

## Adding More Custom Songs

To add another custom song, edit these files:

### 1. Add Lyrics Detection
In `app/api/analyze-memory/route.ts`:
```typescript
if (memoryLower.includes('your keyword')) {
  return NextResponse.json({
    title: "Your Song Title",
    genre: "your genre",
    // ... your custom lyrics
  })
}
```

### 2. Add Audio Detection
In `app/api/generate-song/route.ts`:
```typescript
if (lyricsLower.includes('your song title')) {
  return NextResponse.json({
    audio_url: '/audio/your-song.mp3',
    // ...
  })
}
```

### 3. Add Cover Detection
In `app/create/page.tsx` in the `confirmLyrics` function:
```typescript
const isCustomSong = editedLyrics.toLowerCase().includes('your song title')
if (isCustomSong) {
  setCoverUrl('/audio/your-cover.png')
}
```
