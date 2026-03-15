// Deezer Public API Service
const BASE_URL = 'https://api.deezer.com'

export async function searchTracks(query: string, limit: number = 20) {
  try {
    const response = await fetch(
      `${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`
    )

    if (!response.ok) throw new Error('Deezer API error')

    const data = await response.json()
    
    return data.data?.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.artist?.name || 'Unknown',
      artistId: track.artist?.id,
      album: track.album?.title || 'Unknown',
      albumCover: track.album?.cover_medium || track.album?.cover,
      duration: track.duration,
      preview: track.preview,
      link: track.link,
      source: 'deezer'
    })) || []
  } catch (error) {
    console.error('Deezer search error:', error)
    return []
  }
}

export async function searchByGenre(genre: string, limit: number = 20) {
  try {
    const response = await fetch(
      `${BASE_URL}/search?q=genre:"${encodeURIComponent(genre)}"&limit=${limit}`
    )

    if (!response.ok) throw new Error('Deezer API error')

    const data = await response.json()
    
    return data.data?.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.artist?.name || 'Unknown',
      artistId: track.artist?.id,
      artistImage: track.artist?.picture_medium,
      album: track.album?.title || 'Unknown',
      albumCover: track.album?.cover_medium || track.album?.cover,
      duration: track.duration,
      preview: track.preview,
      link: track.link,
      source: 'deezer'
    })) || []
  } catch (error) {
    console.error('Deezer genre search error:', error)
    return []
  }
}

export async function getArtist(artistId: string) {
  try {
    const response = await fetch(`${BASE_URL}/artist/${artistId}`)

    if (!response.ok) throw new Error('Deezer API error')

    const data = await response.json()
    
    return {
      id: data.id,
      name: data.name,
      image: data.picture_medium,
      imageBig: data.picture_big,
      fans: data.nb_fan,
      albums: data.nb_album,
      link: data.link,
      source: 'deezer'
    }
  } catch (error) {
    console.error('Deezer artist error:', error)
    return null
  }
}

export async function getTopTracks(limit: number = 20) {
  try {
    // Get chart tracks
    const response = await fetch(`${BASE_URL}/chart/0/tracks?limit=${limit}`)

    if (!response.ok) throw new Error('Deezer API error')

    const data = await response.json()
    
    return data.data?.map((track: any) => ({
      id: track.id,
      title: track.title,
      artist: track.artist?.name || 'Unknown',
      artistId: track.artist?.id,
      album: track.album?.title || 'Unknown',
      albumCover: track.album?.cover_medium || track.album?.cover,
      duration: track.duration,
      preview: track.preview,
      link: track.link,
      position: track.position,
      source: 'deezer'
    })) || []
  } catch (error) {
    console.error('Deezer top tracks error:', error)
    return []
  }
}
