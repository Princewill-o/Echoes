import { NextRequest, NextResponse } from 'next/server'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''

export async function POST(req: NextRequest) {
  try {
    const { messages, userName } = await req.json()

    const systemPrompt = `You are a friendly, upbeat music buddy chatbot. Your role is to:
- Listen to how people are feeling
- Be empathetic and supportive
- Cheer them up with positivity and encouragement
- Use emojis occasionally to be friendly
- Keep responses concise (2-3 sentences max)
- After a few exchanges, offer to create a personalized song for them
- If they haven't shared their name yet, ask for it naturally in conversation
- Once you have their name, tell them you've created a special song just for them

${userName ? `The user's name is ${userName}.` : 'You don\'t know the user\'s name yet.'}

Be warm, genuine, and like a supportive friend. Don't be overly formal.`

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        model: 'gpt-4o',
        temperature: 0.8,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error(`GitHub AI API error: ${response.status}`)
    }

    const data = await response.json()
    const assistantMessage = data.choices[0].message.content

    // Check if we should show the song player
    const showSong = userName && (
      assistantMessage.toLowerCase().includes('song') ||
      assistantMessage.toLowerCase().includes('created') ||
      assistantMessage.toLowerCase().includes('made')
    )

    // Check if AI is asking for name
    const askForName = !userName && (
      assistantMessage.toLowerCase().includes('name') ||
      assistantMessage.toLowerCase().includes('call you')
    )

    return NextResponse.json({
      message: assistantMessage,
      showSong,
      askForName
    })

  } catch (error) {
    console.error('Chat buddy error:', error)
    return NextResponse.json(
      { 
        message: "I'm having a little trouble right now, but I'm still here for you! 💙",
        showSong: false,
        askForName: false
      },
      { status: 200 }
    )
  }
}
