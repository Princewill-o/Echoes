import { NextResponse } from 'next/server'
import { getTrending } from '../services/aggregator'

export async function GET() {
  try {
    const data = await getTrending()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Trending API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending music' },
      { status: 500 }
    )
  }
}
