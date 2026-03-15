import { NextResponse } from 'next/server'
import { getGenreMusic } from '../music/services/aggregator'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const genre = searchParams.get('genre') || 'Electronic'

    // Use the music aggregator
    const data = await getGenreMusic(genre)

    // Transform to inspiration format
    const tracks = data.tracks.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      genre: genre,
      duration: track.duration,
      audioUrl: track.preview,
      coverUrl: track.albumCover,
      shareUrl: track.link,
      album: track.album,
      source: track.source
    }))

    return NextResponse.json({
      tracks,
      genre,
      availableGenres: [
        'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical',
        'Electronic', 'R&B', 'Country', 'Blues', 'Metal'
      ]
    })

  } catch (error) {
    console.error('Error fetching inspiration:', error)
    
    return NextResponse.json({
      tracks: [],
      genre: 'Electronic',
      availableGenres: [
        'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical',
        'Electronic', 'R&B', 'Country', 'Blues', 'Metal'
      ],
      error: 'Could not fetch inspiration tracks'
    })
  }
}
