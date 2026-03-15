'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Music, Sparkles, Library, Heart, Play } from 'lucide-react'
import Sidebar from './components/Sidebar'
import { EnhancedMemoryInput } from '../components/ui/enhanced-memory-input'
import { AnimatedBackground } from '../components/ui/animated-background'
import { useThemeState } from './hooks/useThemeState'

export default function Home() {
  const router = useRouter()
  const isDark = useThemeState()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Simple loading state without AnimatedBackground
  if (!mounted) {
    return (
      <>
        <Sidebar />
        <div className={`min-h-screen pl-[60px] md:pl-56 flex items-center justify-center ${isDark ? 'bg-[#04020b]' : 'bg-slate-50'}`}>
          <div className={`text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Loading Echoes...</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <div className={`min-h-screen relative pl-[60px] md:pl-56 transition-colors duration-300 ${isDark ? 'bg-[#04020b]' : 'bg-slate-50'}`}>
        <AnimatedBackground particleCount={600} baseHue={280}>
          <div className="min-h-screen relative">
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 md:p-10">
            <div className="max-w-3xl w-full text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 bg-fuchsia-500/15 border-fuchsia-400/30 mb-6">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <span className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-300">
                AI-Powered Music Creation
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className={`bg-gradient-to-r ${isDark ? 'from-white via-fuchsia-200 to-violet-300' : 'from-slate-900 via-fuchsia-700 to-violet-700'} bg-clip-text text-transparent`}>
                Turn Memories
              </span>
              <br />
              <span className={`bg-gradient-to-r ${isDark ? 'from-violet-300 via-fuchsia-300 to-pink-300' : 'from-violet-700 via-fuchsia-700 to-pink-700'} bg-clip-text text-transparent`}>
                Into Music
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Describe a moment, and watch AI transform it into a cinematic song with lyrics, music, and album art.
            </p>

            {/* Enhanced Memory Input */}
            <EnhancedMemoryInput 
              onSubmit={(mem) => router.push(`/create?memory=${encodeURIComponent(mem)}`)}
              className="mb-12"
            />

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className={`p-6 backdrop-blur rounded-2xl border-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/60 border-slate-200'}`}>
                <div className={`w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto border ${isDark ? 'border-white/10' : 'border-violet-200'}`}>
                  <Sparkles className="w-6 h-6 text-fuchsia-400" />
                </div>
                <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Lyrics</h3>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                  Emotional, poetic lyrics crafted from your memory
                </p>
              </div>

              <div className={`p-6 backdrop-blur rounded-2xl border-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/60 border-slate-200'}`}>
                <div className={`w-12 h-12 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto border ${isDark ? 'border-white/10' : 'border-pink-200'}`}>
                  <Music className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Instrumental Music</h3>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                  60-second soundtrack matching your mood
                </p>
              </div>

              <div className={`p-6 backdrop-blur rounded-2xl border-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/60 border-slate-200'}`}>
                <div className={`w-12 h-12 bg-gradient-to-br from-sky-500/20 to-violet-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto border ${isDark ? 'border-white/10' : 'border-sky-200'}`}>
                  <Heart className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Album Art</h3>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                  Custom cover art generated for each song
                </p>
              </div>
            </div>
          </div>

          {/* Recent Songs Preview */}
          <div className="max-w-3xl w-full mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Your Echoes</h2>
              <button
                onClick={() => router.push('/library')}
                className={`flex items-center gap-2 transition-colors text-sm font-semibold ${isDark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <Library className="w-4 h-4" />
                View All
              </button>
            </div>

            <RecentSongs isDark={isDark} />
          </div>
          </div>
        </div>
        </AnimatedBackground>
      </div>
    </>
  )
}

function RecentSongs({ isDark }: { isDark: boolean }) {
  const [songs, setSongs] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('echoes_songs')
    if (stored) {
      setSongs(JSON.parse(stored).slice(0, 3))
    }
  }, [])

  if (songs.length === 0) {
    return (
      <div className={`text-center py-12 backdrop-blur rounded-3xl border-2 ${isDark ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/60 border-slate-200'}`}>
        <Music className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
        <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>No songs yet. Create your first memory song!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {songs.map((song) => (
        <div
          key={song.id}
          className={`group rounded-2xl overflow-hidden border-2 backdrop-blur-sm transition-all cursor-pointer ${
            isDark 
              ? 'bg-white/[0.03] border-white/[0.06] hover:border-fuchsia-400/30' 
              : 'bg-white/60 border-slate-200 hover:border-fuchsia-400/50'
          }`}
        >
          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            {song.coverUrl ? (
              <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className={`w-12 h-12 ${isDark ? 'text-white/20' : 'text-slate-300'}`} />
              </div>
            )}
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-[#060410] via-transparent to-transparent' : 'bg-gradient-to-t from-slate-900/40 via-transparent to-transparent'}`} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h4 className={`text-sm font-bold mb-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{song.title}</h4>
            <p className={`text-xs truncate ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{song.metadata?.genre}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
