import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { lyrics, genre, mood, tempo, memory } = await req.json()

    // Check if this is the secondary school menace memory - use custom audio
    const lyricsLower = lyrics?.toLowerCase() || ''
    const memoryLower = memory?.toLowerCase() || ''
    
    if (
      (lyricsLower.includes('menace in the hallways') || 
       lyricsLower.includes('kings of detention') ||
       lyricsLower.includes('certified menace at fourteen')) ||
      (memoryLower.includes('secondary school') && 
       memoryLower.includes('funniest') && 
       (memoryLower.includes('menace') || memoryLower.includes('havoc') || memoryLower.includes('silly')))
    ) {
      // Return the custom audio file
      return NextResponse.json({
        audio_url: '/audio/menace-song.mp3',
        filename: 'menace-song.mp3',
        prompt: 'Custom song: Menace in the Hallways',
        provider: 'custom',
        note: 'Using pre-recorded custom song'
      })
    }

    // Build a detailed prompt for music generation
    const prompt = `${genre} music, ${mood} emotional vibe, ${tempo} tempo, cinematic soundtrack with vocals`

    console.log('Sending to music server:', { prompt, hasLyrics: !!lyrics })

    // Call the music generation service (ElevenLabs or demo)
    const response = await fetch('http://127.0.0.1:5000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt,
        lyrics  // Pass lyrics to the server
      }),
    })

    if (!response.ok) {
      throw new Error(`Music service error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      audio_url: data.audio_url,
      filename: data.filename,
      prompt: prompt,
      provider: data.provider,
      note: data.note
    })

  } catch (error) {
    console.error('Error generating song:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate music',
        message: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure the MusicGen service is running on http://localhost:5000'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/health')
    const data = await response.json()
    return NextResponse.json({ status: 'ok', musicgen: data })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Music service not available',
        hint: 'Run: cd ai-service && python elevenlabs_music_server.py'
      },
      { status: 503 }
    )
  }
}
