import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { memory } = await request.json()

    // Analyze memory for emotion and genre
    const analysisPrompt = `Analyze this memory and extract:
- Emotion (one word)
- Music genre (one word)
- Tempo (slow/medium/fast)

Memory: "${memory}"

Respond in JSON format: {"emotion": "...", "genre": "...", "tempo": "..."}`

    const analysis = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: analysisPrompt }],
      response_format: { type: 'json_object' }
    })

    const metadata = JSON.parse(analysis.choices[0].message.content || '{}')

    // Generate song title and lyrics
    const songPrompt = `Create a song based on this memory:
"${memory}"

Style: ${metadata.genre}, ${metadata.emotion}, ${metadata.tempo} tempo

Generate:
1. A short, evocative song title (3-5 words)
2. Complete song lyrics with verse, chorus, and bridge

Respond in JSON format: {"title": "...", "lyrics": "..."}`

    const song = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: songPrompt }],
      response_format: { type: 'json_object' }
    })

    const songData = JSON.parse(song.choices[0].message.content || '{}')

    return NextResponse.json({
      ...songData,
      metadata
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate song' },
      { status: 500 }
    )
  }
}
