'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Music, Play, Heart, ChevronRight } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { AnimatedBackground } from '../../components/ui/animated-background'
import { useThemeState } from '../hooks/useThemeState'

export default function Library() {
  const [songs, setSongs] = useState<any[]>([])
  const [inspirationTracks, setInspirationTracks] = useState<any[]>([])
  const [selectedGenre, setSelectedGenre] = useState('Electronic')
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  const [showInspiration, setShowInspiration] = useState(false)
  const [loadingInspiration, setLoadingInspiration] = useState(false)
  const router = useRouter()
  const isDark = useThemeState()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('echoes_songs') || '[]')
    setSongs(stored)
  }, [])

  useEffect(() => {
    if (showInspiration) {
      fetchInspiration(selectedGenre)
    }
  }, [showInspiration, selectedGenre])

  const fetchInspiration = async (genre: string) => {
    setLoadingInspiration(true)
    try {
      const response = await fetch(`/api/inspiration?genre=${encodeURIComponent(genre)}`)
      const data = await response.json()
      setInspirationTracks(data.tracks || [])
      setAvailableGenres(data.availableGenres || [])
    } catch (error) {
      console.error('Failed to fetch inspiration:', error)
    } finally {
      setLoadingInspiration(false)
    }
  }

  const clearSongsWithoutCovers = () => {
    const songsWithCovers = songs.filter(song => song.coverUrl)
    localStorage.setItem('echoes_songs', JSON.stringify(songsWithCovers))
    setSongs(songsWithCovers)
  }

  return (
    <>
      <Sidebar />
      <AnimatedBackground particleCount={600} baseHue={280}>
        <div className="min-h-screen relative pl-[60px] md:pl-56">
          <div className="relative z-10 p-6 md:p-10">
        {/* Flow Banner */}
        <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border-2 mb-8 ${isDark ? 'bg-sky-500/20 border-sky-400/25' : 'bg-sky-100 border-sky-300'}`}>
          <div className="flex items-center gap-2.5">
            <span className="text-base">📦</span>
            <span className={`text-xs font-bold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>Your memory archive — click any song to play</span>
          </div>
          <button onClick={() => router.push('/')} className={`text-[10px] font-black flex items-center gap-1 transition-colors ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
            <span>Back to Home →</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="mb-8">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 mb-5 ${isDark ? 'bg-fuchsia-500/15 border-fuchsia-400/30' : 'bg-fuchsia-100 border-fuchsia-300'}`}>
            <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className={`text-[9px] font-black uppercase tracking-[0.18em] ${isDark ? 'text-fuchsia-300' : 'text-fuchsia-700'}`}>Memory Box</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Library</h2>
              <p className={`text-sm max-w-xl ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Every moment you've turned into sound.</p>
            </div>
            {songs.length > 0 && songs.some(song => !song.coverUrl) && (
              <button
                onClick={clearSongsWithoutCovers}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isDark 
                    ? 'bg-red-500/20 border-2 border-red-400/30 text-red-300 hover:bg-red-500/30' 
                    : 'bg-red-100 border-2 border-red-300 text-red-700 hover:bg-red-200'
                }`}
              >
                Clear Songs Without Covers
              </button>
            )}
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-fuchsia-900/50">
              <Music className="w-10 h-10 text-white" />
            </div>
            <p className={`text-xl mb-4 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>No memories yet</p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white rounded-2xl font-black shadow-xl shadow-fuchsia-900/40 border-2 border-white/10 transition-all"
            >
              Create Your First Song
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {songs.map((song) => (
              <div
                key={song.id}
                className={`group rounded-3xl overflow-hidden border-2 backdrop-blur-sm hover:-translate-y-1 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-white/[0.03] border-white/[0.06] hover:border-fuchsia-400/30' 
                    : 'bg-white/60 border-slate-200 hover:border-fuchsia-400/50'
                }`}
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  {song.coverUrl ? (
                    <>
                      <img 
                        src={song.coverUrl} 
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060410] via-transparent to-transparent" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Music className="w-16 h-16 text-white/20" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060410] via-[#060410]/20 to-transparent" />
                    </>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  <button className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-3.5 h-3.5 text-white/20" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-white drop-shadow-lg'}`}>{song.title || 'Untitled'}</h4>
                    <p className={`text-[10px] line-clamp-2 ${isDark ? 'text-white/50' : 'text-white/80 drop-shadow'}`}>{song.memory}</p>
                  </div>
                </div>
                <div className={`px-4 py-3 border-t ${isDark ? 'border-white/[0.05]' : 'border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
                      {song.metadata?.genre || 'Memory'}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{song.date}</span>
                  </div>
                  {song.metadata?.emotion && (
                    <div className="flex gap-1">
                      <span className={`px-2 py-0.5 border rounded-full text-[9px] font-black ${isDark ? 'bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-300' : 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700'}`}>
                        {song.metadata.emotion}
                      </span>
                    </div>
                  )}
                  {song.audioUrl && (
                    <div className={`mt-2 flex items-center gap-1 text-[9px] ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />
                      Audio ready
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inspiration Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Get Inspired</h2>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Discover free music from talented artists around the world</p>
            </div>
            <button
              onClick={() => setShowInspiration(!showInspiration)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                isDark 
                  ? 'bg-violet-500/20 border-2 border-violet-400/30 text-violet-300 hover:bg-violet-500/30' 
                  : 'bg-violet-100 border-2 border-violet-300 text-violet-700 hover:bg-violet-200'
              }`}
            >
              {showInspiration ? 'Hide' : 'Show'} Inspiration
            </button>
          </div>

          {showInspiration && (
            <>
              {/* Genre Filter */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedGenre === genre
                        ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white'
                        : isDark
                        ? 'bg-white/[0.05] border-2 border-white/[0.08] text-white/60 hover:text-white'
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Inspiration Tracks */}
              {loadingInspiration ? (
                <div className="text-center py-12">
                  <div className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Loading inspiration...</div>
                </div>
              ) : inspirationTracks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {inspirationTracks.map((track) => (
                    <div
                      key={track.id}
                      className={`group rounded-3xl overflow-hidden border-2 backdrop-blur-sm hover:-translate-y-1 transition-all ${
                        isDark 
                          ? 'bg-white/[0.03] border-white/[0.06] hover:border-violet-400/30' 
                          : 'bg-white/60 border-slate-200 hover:border-violet-400/50'
                      }`}
                    >
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                        {track.coverUrl ? (
                          <img 
                            src={track.coverUrl} 
                            alt={track.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Music className={`w-16 h-16 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
                          </div>
                        )}
                        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#060410] via-transparent to-transparent' : 'bg-gradient-to-t from-slate-900/40 via-transparent to-transparent'}`} />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h4 className={`text-sm font-black mb-1 ${isDark ? 'text-white' : 'text-white drop-shadow-lg'}`}>{track.title}</h4>
                          <p className={`text-[10px] ${isDark ? 'text-white/50' : 'text-white/80 drop-shadow'}`}>{track.artist}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-3 border-t ${isDark ? 'border-white/[0.05]' : 'border-slate-200'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
                            {track.genre}
                          </span>
                          <span className={`text-[9px] ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>{track.source}</span>
                        </div>
                        <audio
                          src={track.audioUrl}
                          controls
                          className="w-full h-8"
                          style={{ fontSize: '10px' }}
                        />
                        <a
                          href={track.shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-2 text-[9px] ${isDark ? 'text-white/40 hover:text-white/60' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                        >
                          View on Jamendo →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>No inspiration tracks available</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
        </div>
      </AnimatedBackground>
    </>
  )
}
