import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { memory, genre, mood, emotion, title } = await req.json()

    if (!memory) {
      return NextResponse.json({ error: 'No memory provided' }, { status: 400 })
    }

    // Build a detailed prompt for Fooocus
    const prompt = `cinematic music album cover, ${genre} music artwork, ${mood} atmosphere, ${emotion} feeling, inspired by: ${memory}, dramatic lighting, professional music cover art, high detail, 4k, vinyl cover aesthetic, artistic composition`

    const negativePrompt = 'low quality, blurry, text, watermark, signature, distorted, ugly, bad anatomy, poorly drawn'

    console.log('Generating album cover with Fooocus:', prompt)

    // Call the Fooocus API
    const response = await fetch('http://127.0.0.1:7865/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: negativePrompt,
        aspect_ratio: '1:1',
        style: 'cinematic',
        image_number: 1
      }),
    })

    if (!response.ok) {
      throw new Error(`Fooocus service error: ${response.statusText}`)
    }

    const data = await response.json()

    return NextResponse.json({
      cover_url: data.image_url || data.url || data.path,
      prompt: prompt
    })

  } catch (error) {
    console.error('Error generating cover:', error)
    
    // Return a fallback gradient cover
    return NextResponse.json(
      { 
        error: 'Failed to generate album cover',
        message: error instanceof Error ? error.message : 'Unknown error',
        hint: 'Make sure Fooocus is running: python entry_with_update.py --api',
        fallback: true,
        cover_url: null
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch('http://127.0.0.1:7865/health')
    const data = await response.json()
    return NextResponse.json({ status: 'ok', fooocus: data })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Fooocus service not available',
        hint: 'Run: cd Fooocus && python entry_with_update.py --api'
      },
      { status: 503 }
    )
  }
}
