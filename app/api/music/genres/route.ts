import { NextResponse } from 'next/server'
import { getGenreList } from '../services/aggregator'

export async function GET() {
  try {
    const genres = await getGenreList()
    
    return NextResponse.json({
      genres,
      total: genres.length
    })
  } catch (error) {
    console.error('Genres API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    )
  }
}
