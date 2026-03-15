// TheAudioDB API Service
const BASE_URL = 'https://theaudiodb.com/api/v1/json/2'

export async function searchArtist(artistName: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/search.php?s=${encodeURIComponent(artistName)}`
    )

    if (!response.ok) throw new Error('AudioDB API error')

    const data = await response.json()
    
    if (!data.artists || data.artists.length === 0) return null

    const artist = data.artists[0]
    return {
      id: artist.idArtist,
      name: artist.strArtist,
      genre: artist.strGenre,
      style: artist.strStyle,
      image: artist.strArtistThumb,
      logo: artist.strArtistLogo,
      banner: artist.strArtistBanner,
      bio: artist.strBiographyEN,
      country: artist.strCountry,
      website: artist.strWebsite,
      facebook: artist.strFacebook,
      twitter: artist.strTwitter,
      source: 'audiodb'
    }
  } catch (error) {
    console.error('AudioDB error:', error)
    return null
  }
}

export async function getGenreList() {
  try {
    const response = await fetch(`${BASE_URL}/genre.php`)

    if (!response.ok) throw new Error('AudioDB API error')

    const data = await response.json()
    
    return data.genres?.map((g: any) => ({
      id: g.idGenre,
      name: g.strGenre,
      description: g.strGenreDescription
    })) || []
  } catch (error) {
    console.error('AudioDB genres error:', error)
    return []
  }
}

export async function getArtistAlbums(artistId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/album.php?i=${artistId}`
    )

    if (!response.ok) throw new Error('AudioDB API error')

    const data = await response.json()
    
    return data.album?.map((album: any) => ({
      id: album.idAlbum,
      title: album.strAlbum,
      year: album.intYearReleased,
      cover: album.strAlbumThumb,
      genre: album.strGenre,
      style: album.strStyle,
      source: 'audiodb'
    })) || []
  } catch (error) {
    console.error('AudioDB albums error:', error)
    return []
  }
}
