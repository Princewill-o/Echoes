import { NextRequest, NextResponse } from 'next/server'
import { getArtistDetails } from '../services/aggregator'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json(
        { error: 'Query parameter "name" is required' },
        { status: 400 }
      )
    }

    const data = await getArtistDetails(name)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Artist API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artist details' },
      { status: 500 }
    )
  }
}
