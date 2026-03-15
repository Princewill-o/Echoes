import { NextResponse } from 'next/server'

// Free Music Archive API (no key required for basic usage)
// Alternative: Jamendo API, ccMixter

const GENRES = [
  'Electronic',
  'Rock',
  'Hip-Hop',
  'Jazz',
  'Classical',
  'Folk',
  'Pop',
  'Ambient',
  'Experimental',
  'Blues'
]

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const genre = searchParams.get('genre') || 'Electronic'

    // Using Jamendo API (free, no key required for basic usage)
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=56d30c95&format=json&limit=12&tags=${genre.toLowerCase()}&include=musicinfo&imagesize=200`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch inspiration tracks')
    }

    const data = await response.json()

    // Transform the data to our format
    const tracks = data.results.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      genre: genre,
      duration: track.duration,
      audioUrl: track.audio,
      coverUrl: track.image || track.album_image,
      shareUrl: track.shareurl,
      license: 'CC BY-SA',
      source: 'Jamendo'
    }))

    return NextResponse.json({
      tracks,
      genre,
      availableGenres: GENRES
    })

  } catch (error) {
    console.error('Error fetching inspiration:', error)
    
    // Return fallback data
    return NextResponse.json({
      tracks: [],
      genre: 'Electronic',
      availableGenres: GENRES,
      error: 'Could not fetch inspiration tracks'
    })
  }
}
