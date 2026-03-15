# Music Buddy Chat Feature

## Overview
A friendly AI chatbot that listens to users, cheers them up, and creates personalized songs for them.

## Features

### 1. Empathetic Conversation
- Listens to how users are feeling
- Provides supportive, upbeat responses
- Uses GitHub AI (GPT-4o) for natural conversations
- Keeps responses concise and friendly

### 2. Name Collection
- Naturally asks for the user's name during conversation
- Personalizes responses once name is known
- Creates a more intimate, friendly experience

### 3. Song Surprise
- After getting to know the user, offers a personalized song
- Shows a beautiful song player interface
- Plays a custom MP3 file (you need to add this)

### 4. Theme Support
- Full dark/light mode support
- Animated particle background
- Smooth, modern UI with glassmorphism effects

## How to Use

### Access the Chat
Navigate to: `http://localhost:3000/chat`

Or click "Music Buddy" in the sidebar navigation.

### Add Your Custom Song
1. Place your MP3 file at: `public/audio/menace-song.mp3`
2. The chatbot will automatically play it when appropriate
3. The song player appears after the bot offers the song

### Example Conversation Flow
1. User: "I'm feeling a bit down today"
2. Bot: "I'm sorry to hear that! 💙 What's been on your mind? I'm here to listen."
3. User: "Just stressed about work"
4. Bot: "Work stress is tough! What's your name, by the way? I'd love to know who I'm talking to 😊"
5. User: "I'm Alex"
6. Bot: "That's a lovely name, Alex! 🎵 You know what? I've created something special just for you. I made a song that captures your vibe! Want to hear it?"
7. [Song player appears with play/pause button]

## Custom Lyrics Feature

### Secondary School Memory
When a user enters this specific memory on the main create page:
```
"back in secondary school the funniest time of my life where i used to be silly, cause havoc and be a menace"
```

The system will automatically use the custom lyrics for "Menace in the Hallways" instead of generating new ones.

### How It Works
- The API checks for keywords: "secondary school", "funniest", "menace/havoc/silly"
- If matched, returns pre-written lyrics
- Otherwise, generates new lyrics using AI

### Adding More Custom Lyrics
Edit `app/api/analyze-memory/route.ts` and add more conditions:

```typescript
if (memoryLower.includes('your keyword')) {
  return NextResponse.json({
    title: "Your Song Title",
    genre: "your genre",
    mood: "your mood",
    tempo: "slow/medium/fast",
    emotion: "your emotion",
    lyrics: `[Verse 1]\nYour lyrics here...`
  })
}
```

## Technical Details

### Files Created
- `app/chat/page.tsx` - Main chat interface
- `app/api/chat-buddy/route.ts` - AI chatbot API endpoint
- `public/audio/menace-song.mp3` - Custom song file (you need to add)

### Files Modified
- `app/components/Sidebar.tsx` - Added "Music Buddy" navigation link
- `app/api/analyze-memory/route.ts` - Added custom lyrics detection

### API Endpoints
- `POST /api/chat-buddy` - Handles chat conversations
  - Input: `{ messages: Message[], userName?: string }`
  - Output: `{ message: string, showSong: boolean, askForName: boolean }`

### Environment Variables Required
- `GITHUB_TOKEN` - For GitHub AI (GPT-4o) access

## Styling
- Uses the same AnimatedBackground component as other pages
- Fully responsive design
- Theme-aware colors (dark/light mode)
- Smooth animations and transitions
- Glassmorphism effects for modern look

## Future Enhancements
- Multiple song options based on mood
- Voice input for messages
- Song generation directly in chat
- Mood tracking over time
- Playlist creation from chat history
