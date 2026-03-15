# Music Aggregator API Documentation

## Overview
A comprehensive music discovery API that aggregates data from multiple free, no-auth music APIs:
- **MusicBrainz** - Artist metadata and recordings
- **TheAudioDB** - Artist artwork, albums, and genres
- **Deezer** - Track previews, search, and trending music

## Base URL
```
http://localhost:3000/api/music
```

## Endpoints

### 1. Get Music by Genre
Fetch artists and tracks for a specific genre.

```
GET /api/music/genre/{genre}
```

**Example:**
```bash
curl http://localhost:3000/api/music/genre/rock
```

**Response:**
```json
{
  "genre": "rock",
  "artists": [
    {
      "id": "artist-id",
      "name": "Radiohead",
      "image": "https://...",
      "bio": "Artist biography...",
      "country": "GB",
      "tags": ["rock", "alternative"],
      "source": "musicbrainz"
    }
  ],
  "tracks": [
    {
      "id": "track-id",
      "title": "Song Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "albumCover": "https://...",
      "duration": 240,
      "preview": "https://...mp3",
      "link": "https://deezer.com/...",
      "source": "deezer"
    }
  ],
  "totalArtists": 5,
  "totalTracks": 20
}
```

### 2. Search Music
Search for tracks and recordings across all sources.

```
GET /api/music/search?q={query}
```

**Example:**
```bash
curl "http://localhost:3000/api/music/search?q=coldplay"
```

**Response:**
```json
{
  "query": "coldplay",
  "tracks": [...],
  "recordings": [...],
  "totalResults": 40
}
```

### 3. Get Artist Details
Fetch detailed information about an artist including albums.

```
GET /api/music/artist?name={artistName}
```

**Example:**
```bash
curl "http://localhost:3000/api/music/artist?name=Coldplay"
```

**Response:**
```json
{
  "artist": {
    "id": "artist-id",
    "name": "Coldplay",
    "genre": "Rock",
    "image": "https://...",
    "bio": "Biography...",
    "country": "GB",
    "website": "https://...",
    "facebook": "...",
    "twitter": "...",
    "source": "audiodb"
  },
  "albums": [
    {
      "id": "album-id",
      "title": "Parachutes",
      "year": "2000",
      "cover": "https://...",
      "genre": "Rock",
      "source": "audiodb"
    }
  ],
  "metadata": {...}
}
```

### 4. Get Trending Music
Fetch currently trending tracks from Deezer charts.

```
GET /api/music/trending
```

**Example:**
```bash
curl http://localhost:3000/api/music/trending
```

**Response:**
```json
{
  "trending": [
    {
      "id": "track-id",
      "title": "Song Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "albumCover": "https://...",
      "duration": 240,
      "preview": "https://...mp3",
      "link": "https://...",
      "position": 1,
      "source": "deezer"
    }
  ],
  "total": 20
}
```

### 5. Get Genre List
Fetch available music genres.

```
GET /api/music/genres
```

**Example:**
```bash
curl http://localhost:3000/api/music/genres
```

**Response:**
```json
{
  "genres": [
    {
      "id": 1,
      "name": "Rock",
      "description": "Rock music genre"
    },
    {
      "id": 2,
      "name": "Pop",
      "description": "Pop music genre"
    }
  ],
  "total": 15
}
```

### 6. Get Inspiration (Legacy)
Fetch inspiration tracks for the library page.

```
GET /api/inspiration?genre={genre}
```

**Example:**
```bash
curl "http://localhost:3000/api/inspiration?genre=Electronic"
```

## Data Sources

### MusicBrainz
- **URL:** https://musicbrainz.org/ws/2/
- **Features:** Artist metadata, recordings, tags
- **Rate Limit:** 1 request per second
- **No API key required**

### TheAudioDB
- **URL:** https://theaudiodb.com/api/v1/json/2/
- **Features:** Artist artwork, albums, genres, biographies
- **Free tier:** Limited to 2 requests per second
- **No API key required for basic usage**

### Deezer
- **URL:** https://api.deezer.com
- **Features:** Track search, previews, charts, artist info
- **Rate Limit:** Generous, no strict limits
- **No API key required**

## Response Format

All endpoints return JSON with a consistent structure:

```json
{
  "data": {...},
  "error": "Error message (if any)"
}
```

## Error Handling

All endpoints handle errors gracefully and return:

```json
{
  "error": "Error description",
  "tracks": [],
  "artists": []
}
```

## Usage in Frontend

### Example: Fetch Rock Music
```typescript
const response = await fetch('/api/music/genre/rock')
const data = await response.json()

console.log(data.artists) // Array of rock artists
console.log(data.tracks)  // Array of rock tracks
```

### Example: Search for Artist
```typescript
const response = await fetch('/api/music/search?q=radiohead')
const data = await response.json()

console.log(data.tracks) // Matching tracks
```

### Example: Get Trending
```typescript
const response = await fetch('/api/music/trending')
const data = await response.json()

console.log(data.trending) // Top 20 trending tracks
```

## Features

✅ No API keys required
✅ Multiple data sources for reliability
✅ Normalized response format
✅ Artist enrichment (combines metadata from multiple sources)
✅ Track previews (30-second clips)
✅ Album artwork
✅ Genre filtering
✅ Search functionality
✅ Trending charts

## Future Enhancements

- [ ] Redis caching (1-hour TTL)
- [ ] Rate limiting with express-rate-limit
- [ ] Pagination support
- [ ] Advanced filtering (year, country, etc.)
- [ ] Playlist generation
- [ ] Similar artists recommendations
- [ ] Lyrics integration

## Notes

- All preview URLs from Deezer are 30-second clips
- MusicBrainz requires a User-Agent header
- TheAudioDB has a free tier with basic features
- Deezer data is publicly available without authentication
