'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Music, Check, Sparkles, Edit3, Play, Download, Share2, Pause, ArrowLeft } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { AnimatedBackground } from '../../components/ui/animated-background'

const LYRICS_STEPS = [
  { label: 'Analyzing memory emotion', sub: 'Understanding the feeling...', duration: 800, color: 'bg-pink-500' },
  { label: 'Identifying music genre', sub: 'Finding the perfect style...', duration: 700, color: 'bg-violet-500' },
  { label: 'Crafting song structure', sub: 'Verse, chorus, bridge...', duration: 900, color: 'bg-sky-500' },
  { label: 'Writing lyrics', sub: 'Turning memory into poetry...', duration: 1200, color: 'bg-fuchsia-500' }
]

const MUSIC_STEPS = [
  { label: 'Preparing MusicGen AI', sub: 'Loading neural network...', duration: 800, color: 'bg-amber-500' },
  { label: 'Composing melody', sub: 'Creating instrumental base...', duration: 1500, color: 'bg-orange-500' },
  { label: 'Adding harmonies', sub: 'Layering musical elements...', duration: 1200, color: 'bg-teal-500' },
  { label: 'Finalizing audio', sub: 'Rendering your song...', duration: 1000, color: 'bg-green-500' }
]

export default function Create() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const memory = searchParams.get('memory') || ''
  
  const [stage, setStage] = useState<'analyzing' | 'lyrics-review' | 'generating-music' | 'complete'>('analyzing')
  const [genStep, setGenStep] = useState(0)
  const [lyricsData, setLyricsData] = useState<any>(null)
  const [songData, setSongData] = useState<any>(null)
  const [isEditingLyrics, setIsEditingLyrics] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  useEffect(() => {
    generateLyrics()
  }, [])

  // Handle lyrics generation steps
  useEffect(() => {
    if (stage !== 'analyzing') return
    
    let step = 0
    const advance = () => {
      step += 1
      if (step < LYRICS_STEPS.length) {
        setGenStep(step)
        setTimeout(advance, LYRICS_STEPS[step].duration + 300)
      }
    }
    setTimeout(advance, LYRICS_STEPS[0].duration + 300)
  }, [stage])

  // Handle music generation steps
  useEffect(() => {
    if (stage !== 'generating-music') return
    
    let step = 0
    const advance = () => {
      step += 1
      if (step < MUSIC_STEPS.length) {
        setGenStep(step)
        setTimeout(advance, MUSIC_STEPS[step].duration + 300)
      }
    }
    setTimeout(advance, MUSIC_STEPS[0].duration + 300)
  }, [stage])

  // Auto-complete music generation
  useEffect(() => {
    if (stage !== 'generating-music' || !songData) return
    
    const totalTime = MUSIC_STEPS.reduce((a, s) => a + s.duration + 300, 0)
    const timer = setTimeout(() => {
      setStage('complete')
    }, totalTime + 1000)
    
    return () => clearTimeout(timer)
  }, [stage, songData])

  // Initialize audio element
  useEffect(() => {
    if (songData?.audioUrl) {
      const audio = new Audio(songData.audioUrl)
      audio.addEventListener('ended', () => setIsPlaying(false))
      audio.addEventListener('play', () => setIsPlaying(true))
      audio.addEventListener('pause', () => setIsPlaying(false))
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e)
        console.error('Audio URL:', songData.audioUrl)
      })
      setAudioElement(audio)
      
      return () => {
        audio.pause()
        audio.src = ''
        setAudioElement(null)
      }
    }
  }, [songData?.audioUrl])

  const generateLyrics = async () => {
    setStage('analyzing')
    setGenStep(0)
    
    try {
      console.log('Generating lyrics for memory:', memory)
      const response = await fetch('/api/analyze-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memory })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Lyrics generated:', data)
      
      setLyricsData(data)
      setEditedLyrics(data.lyrics)
      
      // Wait for animation to complete
      const totalTime = LYRICS_STEPS.reduce((a, s) => a + s.duration + 300, 0)
      setTimeout(() => {
        setStage('lyrics-review')
      }, totalTime + 500)
    } catch (error) {
      console.error('Lyrics generation failed:', error)
      // Set fallback data so user can still proceed
      const fallbackData = {
        title: 'My Memory Song',
        lyrics: `[Verse]\n${memory}\n\n[Chorus]\nThese moments stay with me\nForever in my memory`,
        genre: 'indie',
        mood: 'reflective',
        tempo: 'medium',
        emotion: 'nostalgic'
      }
      setLyricsData(fallbackData)
      setEditedLyrics(fallbackData.lyrics)
      setStage('lyrics-review')
    }
  }

  const confirmLyrics = async () => {
    setStage('generating-music')
    setGenStep(0)
    
    try {
      console.log('Generating music with:', {
        genre: lyricsData.genre,
        mood: lyricsData.mood,
        tempo: lyricsData.tempo
      })
      
      // Check if this is the menace song - use custom cover
      const isCustomSong = editedLyrics.toLowerCase().includes('menace in the hallways') || 
                          editedLyrics.toLowerCase().includes('certified menace at fourteen')
      
      if (isCustomSong) {
        // Use custom cover for menace song
        setCoverUrl('/audio/menace.png')
        console.log('Using custom cover: menace.png')
      } else {
        // Start cover generation immediately (don't wait)
        fetch('/api/generate-cover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memory,
            genre: lyricsData.genre,
            mood: lyricsData.mood,
            emotion: lyricsData.emotion,
            title: lyricsData.title
          })
        })
          .then(res => res.json())
          .then(coverData => {
            if (coverData.cover_url) {
              setCoverUrl(coverData.cover_url)
              console.log('Album cover generated:', coverData.cover_url)
            }
          })
          .catch(err => console.log('Cover generation failed:', err))
      }
      
      // Generate music
      const musicResponse = await fetch('/api/generate-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: editedLyrics,
          genre: lyricsData.genre,
          mood: lyricsData.mood,
          tempo: lyricsData.tempo,
          memory: memory  // Pass memory to detect custom song
        })
      })
      
      if (!musicResponse.ok) {
        const errorData = await musicResponse.json()
        console.error('Music generation API error:', errorData)
        throw new Error(errorData.message || 'Music generation failed')
      }
      
      const musicData = await musicResponse.json()
      console.log('Music generated successfully:', musicData)
      
      const completeSong = {
        title: lyricsData.title,
        lyrics: editedLyrics,
        metadata: {
          genre: lyricsData.genre,
          mood: lyricsData.mood,
          tempo: lyricsData.tempo,
          emotion: lyricsData.emotion
        },
        audioUrl: musicData.audio_url,
        coverUrl: isCustomSong ? '/audio/menace.png' : coverUrl, // Use custom cover for menace song
        memory,
        date: new Date().toISOString().split('T')[0],
        id: Date.now()
      }
      
      setSongData(completeSong)
      
      // Save to local storage
      const songs = JSON.parse(localStorage.getItem('echoes_songs') || '[]')
      songs.push(completeSong)
      localStorage.setItem('echoes_songs', JSON.stringify(songs))
      
      console.log('Song saved to library')
    } catch (error) {
      console.error('Music generation failed:', error)
      // Still save lyrics-only version
      const lyricsOnlySong = {
        title: lyricsData.title,
        lyrics: editedLyrics,
        metadata: {
          genre: lyricsData.genre,
          mood: lyricsData.mood,
          tempo: lyricsData.tempo,
          emotion: lyricsData.emotion
        },
        coverUrl: coverUrl, // Include cover even if music failed
        memory,
        date: new Date().toISOString().split('T')[0],
        id: Date.now(),
        musicGenError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
      setSongData(lyricsOnlySong)
      
      const songs = JSON.parse(localStorage.getItem('echoes_songs') || '[]')
      songs.push(lyricsOnlySong)
      localStorage.setItem('echoes_songs', JSON.stringify(songs))
      
      console.log('Saved lyrics-only version due to error')
      setStage('complete')
    }
  }

  const togglePlay = () => {
    if (!audioElement) return
    
    if (isPlaying) {
      audioElement.pause()
    } else {
      audioElement.play()
    }
  }

  const downloadSong = () => {
    if (!songData?.audioUrl) return
    
    const link = document.createElement('a')
    link.href = songData.audioUrl
    link.download = `${songData.title.replace(/[^a-z0-9]/gi, '_')}.wav`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareSong = async () => {
    const shareData = {
      title: `${songData.title} - Echoes`,
      text: `Listen to my memory song: "${songData.title}"\n\nMemory: ${memory}`,
      url: window.location.href
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      alert('Song details copied to clipboard!')
    }
  }

  // STAGE 1: Analyzing Memory
  if (stage === 'analyzing') {
    return (
      <>
        <Sidebar />
        <AnimatedBackground particleCount={600} baseHue={280}>
          <div className="min-h-screen flex items-center justify-center relative pl-[60px] md:pl-56">
            <div className="relative z-10 flex flex-col items-center justify-center p-8">
          <div className="relative w-52 h-52 mb-12">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="absolute rounded-full border-2 border-dashed animate-spin"
                style={{
                  inset: `${i * 20}px`,
                  borderColor: ['rgba(217,70,239,0.35)', 'rgba(139,92,246,0.25)', 'rgba(236,72,153,0.18)'][i],
                  animationDuration: `${[7, 5, 3][i]}s`,
                  animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-fuchsia-900/60 border-4 border-white/10 animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-transparent">
              Analyzing your memory
            </h2>
            <p className="text-sm max-w-xl mx-auto leading-relaxed text-white/60">
              Creating lyrics that capture the emotion of your moment
            </p>
          </div>

          <div className="w-84 max-w-sm space-y-3">
            {LYRICS_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex items-center gap-3"
                style={{
                  opacity: i <= genStep ? 1 : 0.15
                }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                  i < genStep 
                    ? `${step.color} border-transparent` 
                    : i === genStep 
                    ? 'border-fuchsia-400 bg-fuchsia-500/20' 
                    : 'border-white/10 bg-transparent'
                }`}>
                  {i < genStep ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : i === genStep ? (
                    <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                  ) : null}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-bold ${i <= genStep ? 'text-white' : 'text-white/20'}`}>
                    {step.label}
                  </p>
                  <p className={`text-[10px] ${i <= genStep ? 'text-white/50' : 'text-white/10'}`}>
                    {step.sub}
                  </p>
                </div>
                {i <= genStep && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${step.color}`} />}
              </div>
            ))}
          </div>
        </div>
          </div>
        </AnimatedBackground>
      </>
    )
  }

  // STAGE 2: Lyrics Review
  if (stage === 'lyrics-review') {
    return (
      <>
        <Sidebar />
        <AnimatedBackground particleCount={600} baseHue={280}>
          <div className="min-h-screen relative pl-[60px] md:pl-56">
            <div className="relative z-10 p-6 md:p-10 max-w-4xl mx-auto">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 bg-fuchsia-500/15 border-fuchsia-400/30 mb-4">
              <Check className="w-3 h-3 text-fuchsia-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-300">
                Lyrics Generated
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">Review Your Lyrics</h2>
            <p className="text-white/60 italic mb-2">"{memory}"</p>
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="px-3 py-1 bg-violet-500/20 border border-violet-400/40 rounded-full text-violet-300 font-semibold">
                {lyricsData?.genre}
              </span>
              <span className="px-3 py-1 bg-pink-500/20 border border-pink-400/40 rounded-full text-pink-300 font-semibold">
                {lyricsData?.emotion}
              </span>
              <span className="px-3 py-1 bg-sky-500/20 border border-sky-400/40 rounded-full text-sky-300 font-semibold">
                {lyricsData?.tempo}
              </span>
            </div>
          </div>

          <div className="bg-white/[0.03] backdrop-blur rounded-3xl p-8 border-2 border-white/[0.06] mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-white">{lyricsData?.title}</h3>
              <button
                onClick={() => setIsEditingLyrics(!isEditingLyrics)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-sm"
              >
                <Edit3 className="w-4 h-4" />
                {isEditingLyrics ? 'Preview' : 'Edit'}
              </button>
            </div>

            {isEditingLyrics ? (
              <textarea
                value={editedLyrics}
                onChange={(e) => setEditedLyrics(e.target.value)}
                className="w-full h-96 bg-black/30 border-2 border-white/10 rounded-xl p-6 text-white/90 font-mono text-sm focus:outline-none focus:border-fuchsia-400/50 resize-none"
                placeholder="Edit your lyrics..."
              />
            ) : (
              <div className="bg-black/20 rounded-xl p-6 whitespace-pre-line text-sm text-white/80 leading-relaxed">
                {editedLyrics}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors text-white font-bold"
            >
              Cancel
            </button>
            <button
              onClick={confirmLyrics}
              className="flex-1 py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-2xl transition-all text-white font-black shadow-xl shadow-fuchsia-900/40 border-2 border-white/10 flex items-center justify-center gap-2"
            >
              <Music className="w-5 h-5" />
              Generate Music
            </button>
          </div>
        </div>
          </div>
        </AnimatedBackground>
      </>
    )
  }

  // STAGE 3: Generating Music
  if (stage === 'generating-music') {
    return (
      <>
        <Sidebar />
        <AnimatedBackground particleCount={600} baseHue={280}>
          <div className="min-h-screen flex items-center justify-center relative pl-[60px] md:pl-56">
            <div className="relative z-10 flex flex-col items-center justify-center p-8">
          {/* Album Cover Preview */}
          {coverUrl && (
            <div className="mb-8 animate-fade-in">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-fuchsia-900/40 border-4 border-white/10">
                <img 
                  src={coverUrl} 
                  alt="Album Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center mt-3 text-xs text-green-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Album cover ready
              </p>
            </div>
          )}

          <div className="relative w-52 h-52 mb-12">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="absolute rounded-full border-2 border-dashed animate-spin"
                style={{
                  inset: `${i * 20}px`,
                  borderColor: ['rgba(251,146,60,0.35)', 'rgba(34,197,94,0.25)', 'rgba(20,184,166,0.18)'][i],
                  animationDuration: `${[7, 5, 3][i]}s`,
                  animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-900/60 border-4 border-white/10 animate-pulse">
                <Music className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
              Generating your music
            </h2>
            <p className="text-sm max-w-xl mx-auto leading-relaxed text-white/60">
              Creating 60-second song with ElevenLabs AI
            </p>
          </div>

          <div className="w-84 max-w-sm space-y-3 mb-10">
            {MUSIC_STEPS.map((step, i) => (
              <div
                key={step.label}
                className="flex items-center gap-3"
                style={{
                  opacity: i <= genStep ? 1 : 0.15
                }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                  i < genStep 
                    ? `${step.color} border-transparent` 
                    : i === genStep 
                    ? 'border-amber-400 bg-amber-500/20' 
                    : 'border-white/10 bg-transparent'
                }`}>
                  {i < genStep ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : i === genStep ? (
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : null}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-bold ${i <= genStep ? 'text-white' : 'text-white/20'}`}>
                    {step.label}
                  </p>
                  <p className={`text-[10px] ${i <= genStep ? 'text-white/50' : 'text-white/10'}`}>
                    {step.sub}
                  </p>
                </div>
                {i <= genStep && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${step.color}`} />}
              </div>
            ))}
          </div>

          <div className="w-80 h-2 rounded-full overflow-hidden border bg-white/5 border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${((genStep + 1) / MUSIC_STEPS.length) * 100}%` }}
            />
          </div>
          <p className="mt-3 text-[11px] font-bold text-white/40">
            {Math.round(((genStep + 1) / MUSIC_STEPS.length) * 100)}% complete
          </p>
        </div>
          </div>
        </AnimatedBackground>
      </>
    )
  }

  // STAGE 4: Complete - Song Ready
  return (
    <>
      <Sidebar />
      <AnimatedBackground particleCount={600} baseHue={280}>
        <div className="min-h-screen relative pl-[60px] md:pl-56">
          <div className="relative z-10 p-6 md:p-10 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 bg-green-500/15 border-green-400/30 mb-4">
            <Check className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-green-300">
              Song Complete
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-white">{songData?.title}</h2>
          <p className="text-white/60 italic">"{memory}"</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Album Art / Player */}
          <div className="bg-white/[0.03] backdrop-blur rounded-3xl p-8 border-2 border-white/[0.06]">
            <div className="aspect-square bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
              {songData?.coverUrl ? (
                <>
                  <img 
                    src={songData.coverUrl} 
                    alt={songData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative text-center p-8">
                    <Music className="w-20 h-20 text-white/90 mx-auto mb-4" />
                    <p className="text-2xl font-black text-white">{songData?.title}</p>
                  </div>
                </>
              )}
            </div>

            {songData?.audioUrl ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all shadow-lg shadow-fuchsia-900/40 border-2 border-white/10"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white fill-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1">Now Playing</p>
                    <p className="text-xs text-white/40">Generated with MusicGen AI</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={downloadSong}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-sm font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={shareSong}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white text-sm font-semibold"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                <audio
                  src={songData.audioUrl}
                  className="w-full"
                  controls
                />
                
                <div className="mt-3 p-3 bg-violet-500/10 border border-violet-400/20 rounded-lg">
                  <p className="text-xs text-violet-300 flex items-center gap-2">
                    <Music className="w-3 h-3" />
                    <span>60-second instrumental • ElevenLabs Music API requires paid plan for vocals</span>
                  </p>
                </div>
              </div>
            ) : songData?.musicGenError ? (
              <div className="p-4 bg-amber-500/10 border border-amber-400/30 rounded-xl">
                <p className="text-sm text-amber-300 mb-2 font-semibold">
                  🎵 MusicGen service unavailable
                </p>
                {songData.errorMessage && (
                  <p className="text-xs text-amber-200/70 mb-3">
                    Error: {songData.errorMessage}
                  </p>
                )}
                <p className="text-xs text-amber-200/60 mb-3">
                  To generate music, start the MusicGen service:
                </p>
                <code className="block bg-black/30 px-3 py-2 rounded text-xs text-amber-200 mb-2">
                  cd ai-service && python musicgen_server.py
                </code>
                <p className="text-xs text-amber-200/50">
                  Or run: <code className="bg-black/30 px-2 py-0.5 rounded">./start-musicgen.sh</code>
                </p>
              </div>
            ) : (
              <div className="p-4 bg-violet-500/10 border border-violet-400/30 rounded-xl">
                <p className="text-sm text-violet-300">
                  💡 Lyrics saved! Start MusicGen to add music.
                </p>
              </div>
            )}
          </div>

          {/* Lyrics */}
          <div className="bg-white/[0.03] backdrop-blur rounded-3xl p-8 border-2 border-white/[0.06]">
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-fuchsia-400" />
              Lyrics
            </h3>
            <div className="bg-black/20 rounded-xl p-6 whitespace-pre-line text-sm text-white/80 leading-relaxed max-h-96 overflow-y-auto">
              {songData?.lyrics}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-violet-500/20 border border-violet-400/40 rounded-full text-xs text-violet-300 font-semibold">
                {songData?.metadata?.genre}
              </span>
              <span className="px-3 py-1 bg-pink-500/20 border border-pink-400/40 rounded-full text-xs text-pink-300 font-semibold">
                {songData?.metadata?.emotion}
              </span>
              <span className="px-3 py-1 bg-sky-500/20 border border-sky-400/40 rounded-full text-xs text-sky-300 font-semibold">
                {songData?.metadata?.tempo}
              </span>
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs text-amber-300 font-semibold">
                {songData?.metadata?.mood}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push('/library')}
            className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors text-white font-bold"
          >
            View Library
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-2xl transition-all text-white font-black shadow-xl shadow-fuchsia-900/40 border-2 border-white/10"
          >
            Create Another Song
          </button>
        </div>
      </div>
        </div>
      </AnimatedBackground>
    </>
  )
}
