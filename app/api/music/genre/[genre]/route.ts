import { NextRequest, NextResponse } from 'next/server'
import { getGenreMusic } from '../../services/aggregator'

export async function GET(
  req: NextRequest,
  { params }: { params: { genre: string } }
) {
  try {
    const genre = params.genre
    const data = await getGenreMusic(genre)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Genre API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch genre music' },
      { status: 500 }
    )
  }
}
