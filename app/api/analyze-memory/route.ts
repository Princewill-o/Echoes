import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { memory } = await req.json()

    if (!memory) {
      return NextResponse.json({ error: 'No memory provided' }, { status: 400 })
    }

    // Check for specific secondary school memory and use custom lyrics
    const memoryLower = memory.toLowerCase()
    if (
      memoryLower.includes('secondary school') && 
      memoryLower.includes('funniest') && 
      (memoryLower.includes('menace') || memoryLower.includes('havoc') || memoryLower.includes('silly'))
    ) {
      return NextResponse.json({
        title: "Menace in the Hallways",
        genre: "indie pop",
        mood: "nostalgic and playful",
        tempo: "medium",
        emotion: "nostalgic joy",
        lyrics: `[Verse 1]
Back in secondary, living wild and free,
Teachers said my name like a warning on TV.
Homework missing, bag full of snacks,
Running through the corridors planning our attacks.

[Pre-Chorus]
Bell goes off, we vanish like ghosts,
Laughing in the hallway louder than most.
Deputy head walking? Time to behave…
Two seconds later we're back causing waves.

[Chorus]
We were the kings of detention, rulers of the prank,
Laughing in the back while the teacher lost rank.
Not a villain, just a legend in disguise,
With chaos in my pockets and trouble in my eyes.
Oh those days, yeah we ran the scene,
Certified menace at fourteen.

[Verse 2]
Silly little plans in the cafeteria line,
Trading crisps like it's organized crime.
Someone pulled the chair, someone cracked a joke,
Whole class laughing till the teacher almost choked.

[Pre-Chorus]
"Who did that?" — silence in the air,
Twenty guilty faces but nobody there.
One look round and the squad just grins,
Another legendary detention begins.

[Chorus]
We were the kings of detention, rulers of the prank,
Laughing in the back while the teacher lost rank.
Not a villain, just a legend in disguise,
With chaos in my pockets and trouble in my eyes.
Oh those days, yeah we ran the scene,
Certified menace at fourteen.

[Bridge]
Now we're older, jobs and bills to pay,
But nothing beats those reckless days.
No stress, no plans, just jokes and noise,
Just a classroom full of chaotic boys.

[Final Chorus]
We were the kings of detention, masters of the laugh,
Turning every boring lesson into comedy math.
Not angels, but memories supreme,
Just a bunch of kids with a mischief dream.
Yeah those days were wild and free,
The funniest years of secondary.`
      })
    }

    // Try GitHub AI first (free)
    const githubToken = process.env.GITHUB_TOKEN
    
    if (githubToken) {
      try {
        const { default: ModelClient } = await import('@azure-rest/ai-inference')
        const { AzureKeyCredential } = await import('@azure/core-auth')

        const client = ModelClient(
          'https://models.github.ai/inference',
          new AzureKeyCredential(githubToken)
        )

        const response = await client.path('/chat/completions').post({
          body: {
            messages: [
              {
                role: 'system',
                content: `You are an award-winning songwriter and music producer who specializes in turning personal memories into deeply emotional, cinematic songs. You craft lyrics that are:
- Poetic and evocative with vivid imagery
- Emotionally resonant and authentic
- Structured with proper song format (Verse, Chorus, Bridge)
- Memorable with strong hooks and melodies
- Universal yet personal in their storytelling

Return ONLY valid JSON with no markdown formatting or code blocks.`
              },
              {
                role: 'user',
                content: `Transform this personal memory into a complete song. Capture the emotion, create vivid imagery, and write lyrics that would make someone feel something deep.

MEMORY:
"${memory}"

INSTRUCTIONS:
1. Identify the core emotion and mood of this memory
2. Choose a genre that best fits the feeling (indie, pop, rock, folk, electronic, R&B, etc.)
3. Create a compelling song title that captures the essence
4. Write complete, professional-quality lyrics with:
   - 2-3 verses that tell the story with specific details and imagery
   - A powerful, memorable chorus that captures the main emotion (repeat 2-3 times)
   - Optional bridge that adds depth or a new perspective
   - Natural flow and rhythm that sounds like a real song
5. Make it emotionally authentic - this is someone's real memory

Return this EXACT JSON format:
{
  "title": "A compelling, evocative song title",
  "genre": "specific genre (indie pop, alternative rock, folk, electronic, etc.)",
  "mood": "the emotional atmosphere (nostalgic, melancholic, hopeful, bittersweet, euphoric, etc.)",
  "tempo": "slow/medium/fast",
  "emotion": "the core feeling (longing, joy, heartbreak, wonder, freedom, etc.)",
  "lyrics": "[Verse 1]\\nFirst verse with vivid imagery and storytelling\\nMultiple lines that paint a picture\\n\\n[Chorus]\\nPowerful, memorable chorus\\nThat captures the main emotion\\nAnd repeats the hook\\n\\n[Verse 2]\\nSecond verse that deepens the story\\nWith more specific details\\n\\n[Chorus]\\nPowerful, memorable chorus\\nThat captures the main emotion\\nAnd repeats the hook\\n\\n[Bridge]\\nA moment of reflection or shift\\nThat adds new depth\\n\\n[Chorus]\\nPowerful, memorable chorus\\nThat captures the main emotion\\nAnd repeats the hook"
}

Make it beautiful, make it real, make it unforgettable.`
              }
            ],
            model: 'gpt-4o',
            temperature: 0.9,
            max_tokens: 1500
          }
        })

        if (response.status === '200') {
          const content = response.body.choices[0].message.content
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          
          if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0])
            return NextResponse.json(analysis)
          }
        }
      } catch (error) {
        console.error('GitHub AI error:', error)
      }
    }

    // Fallback to OpenAI if available
    const openaiKey = process.env.OPENAI_API_KEY
    
    if (openaiKey) {
      try {
        const { default: OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey: openaiKey })

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an award-winning songwriter and music producer who specializes in turning personal memories into deeply emotional, cinematic songs. You craft lyrics that are:
- Poetic and evocative with vivid imagery
- Emotionally resonant and authentic
- Structured with proper song format (Verse, Chorus, Bridge)
- Memorable with strong hooks and melodies
- Universal yet personal in their storytelling

Return ONLY valid JSON with no markdown formatting.`
            },
            {
              role: 'user',
              content: `Transform this personal memory into a complete song. Capture the emotion, create vivid imagery, and write lyrics that would make someone feel something deep.

MEMORY:
"${memory}"

INSTRUCTIONS:
1. Identify the core emotion and mood of this memory
2. Choose a genre that best fits the feeling
3. Create a compelling song title that captures the essence
4. Write complete, professional-quality lyrics with verses, chorus, and optional bridge
5. Make it emotionally authentic - this is someone's real memory

Return this EXACT JSON format:
{
  "title": "A compelling, evocative song title",
  "genre": "specific genre",
  "mood": "the emotional atmosphere",
  "tempo": "slow/medium/fast",
  "emotion": "the core feeling",
  "lyrics": "[Verse 1]\\nFirst verse...\\n\\n[Chorus]\\nChorus...\\n\\n[Verse 2]\\nSecond verse...\\n\\n[Chorus]\\nChorus...\\n\\n[Bridge]\\nBridge...\\n\\n[Chorus]\\nFinal chorus..."
}

Make it beautiful, make it real, make it unforgettable.`
            }
          ],
          temperature: 0.9,
          max_tokens: 1500
        })

        const content = completion.choices[0].message.content || ''
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0])
          return NextResponse.json(analysis)
        }
      } catch (error) {
        console.error('OpenAI error:', error)
      }
    }

    // Simple fallback - create basic but meaningful lyrics
    const words = memory.split(' ').slice(0, 20).join(' ')
    return NextResponse.json({
      genre: 'indie folk',
      mood: 'reflective',
      tempo: 'medium',
      emotion: 'nostalgic',
      title: 'Echoes of Yesterday',
      lyrics: `[Verse 1]\n${words}\nThese moments linger in my mind\nLike photographs that time can't fade\nEvery detail still so clear\n\n[Chorus]\nThese are the echoes of yesterday\nMemories that never go away\nIn my heart they'll always stay\nThese echoes of yesterday\n\n[Verse 2]\nI close my eyes and I'm back there\nFeeling everything like it was real\nThe way it made me come alive\nA moment frozen still in time\n\n[Chorus]\nThese are the echoes of yesterday\nMemories that never go away\nIn my heart they'll always stay\nThese echoes of yesterday\n\n[Bridge]\nSome things we never forget\nThey shape who we become\nAnd though the years may pass us by\nThis memory lives on\n\n[Chorus]\nThese are the echoes of yesterday\nMemories that never go away\nIn my heart they'll always stay\nThese echoes of yesterday`
    })

  } catch (error) {
    console.error('Error analyzing memory:', error)
    return NextResponse.json(
      { error: 'Failed to analyze memory' },
      { status: 500 }
    )
  }
}
