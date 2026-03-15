// Music Aggregator - Combines data from multiple sources
import * as musicbrainz from './musicbrainz'
import * as audiodb from './audiodb'
import * as deezer from './deezer'

export async function getGenreMusic(genre: string) {
  try {
    // Fetch from all sources in parallel
    const [mbArtists, deezerTracks, audioDbGenres] = await Promise.all([
      musicbrainz.searchArtistsByGenre(genre),
      deezer.searchByGenre(genre, 20),
      audiodb.getGenreList()
    ])

    // Enrich artists with AudioDB data
    const enrichedArtists = await Promise.all(
      mbArtists.slice(0, 5).map(async (artist: any) => {
        const audioDbData = await audiodb.searchArtist(artist.name)
        return {
          ...artist,
          image: audioDbData?.image || null,
          bio: audioDbData?.bio || null,
          ...audioDbData
        }
      })
    )

    return {
      genre,
      artists: enrichedArtists,
      tracks: deezerTracks,
      totalArtists: enrichedArtists.length,
      totalTracks: deezerTracks.length
    }
  } catch (error) {
    console.error('Aggregator error:', error)
    return {
      genre,
      artists: [],
      tracks: [],
      totalArtists: 0,
      totalTracks: 0,
      error: 'Failed to fetch music data'
    }
  }
}

export async function searchMusic(query: string) {
  try {
    const [mbRecordings, deezerTracks] = await Promise.all([
      musicbrainz.searchRecordings(query),
      deezer.searchTracks(query, 20)
    ])

    return {
      query,
      tracks: deezerTracks,
      recordings: mbRecordings,
      totalResults: deezerTracks.length + mbRecordings.length
    }
  } catch (error) {
    console.error('Search error:', error)
    return {
      query,
      tracks: [],
      recordings: [],
      totalResults: 0,
      error: 'Search failed'
    }
  }
}

export async function getArtistDetails(artistName: string) {
  try {
    const [audioDbData, mbArtists] = await Promise.all([
      audiodb.searchArtist(artistName),
      musicbrainz.searchArtistsByGenre(artistName)
    ])

    let albums = []
    if (audioDbData?.id) {
      albums = await audiodb.getArtistAlbums(audioDbData.id)
    }

    return {
      artist: audioDbData,
      albums,
      metadata: mbArtists[0] || null
    }
  } catch (error) {
    console.error('Artist details error:', error)
    return {
      artist: null,
      albums: [],
      metadata: null,
      error: 'Failed to fetch artist details'
    }
  }
}

export async function getTrending() {
  try {
    const topTracks = await deezer.getTopTracks(20)

    return {
      trending: topTracks,
      total: topTracks.length
    }
  } catch (error) {
    console.error('Trending error:', error)
    return {
      trending: [],
      total: 0,
      error: 'Failed to fetch trending music'
    }
  }
}

export async function getGenreList() {
  try {
    const genres = await audiodb.getGenreList()
    
    // Add common genres if API fails
    const defaultGenres = [
      'Rock', 'Pop', 'Hip-Hop', 'Jazz', 'Classical',
      'Electronic', 'R&B', 'Country', 'Blues', 'Metal',
      'Folk', 'Reggae', 'Punk', 'Soul', 'Indie'
    ]

    if (genres.length === 0) {
      return defaultGenres.map((name, index) => ({
        id: index + 1,
        name,
        description: `${name} music genre`
      }))
    }

    return genres
  } catch (error) {
    console.error('Genre list error:', error)
    return []
  }
}
