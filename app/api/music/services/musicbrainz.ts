// MusicBrainz API Service
const BASE_URL = 'https://musicbrainz.org/ws/2'

export async function searchArtistsByGenre(genre: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/artist?query=tag:${encodeURIComponent(genre)}&fmt=json&limit=10`,
      {
        headers: {
          'User-Agent': 'Echoes/1.0.0 (https://echoes.app)'
        }
      }
    )

    if (!response.ok) throw new Error('MusicBrainz API error')

    const data = await response.json()
    
    return data.artists?.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      type: artist.type,
      country: artist.country,
      tags: artist.tags?.map((t: any) => t.name) || [],
      source: 'musicbrainz'
    })) || []
  } catch (error) {
    console.error('MusicBrainz error:', error)
    return []
  }
}

export async function searchRecordings(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/recording?query=${encodeURIComponent(query)}&fmt=json&limit=20`,
      {
        headers: {
          'User-Agent': 'Echoes/1.0.0 (https://echoes.app)'
        }
      }
    )

    if (!response.ok) throw new Error('MusicBrainz API error')

    const data = await response.json()
    
    return data.recordings?.map((recording: any) => ({
      id: recording.id,
      title: recording.title,
      artist: recording['artist-credit']?.[0]?.name || 'Unknown',
      length: recording.length,
      source: 'musicbrainz'
    })) || []
  } catch (error) {
    console.error('MusicBrainz recordings error:', error)
    return []
  }
}
