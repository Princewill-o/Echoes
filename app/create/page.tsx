'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function Create() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const memory = searchParams.get('memory') || ''
  
  const [stage, setStage] = useState<'analyzing' | 'generating' | 'complete'>('analyzing')
  const [songData, setSongData] = useState<any>(null)

  useEffect(() => {
    generateSong()
  }, [])

  const generateSong = async () => {
    setStage('analyzing')
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setStage('generating')
    
    // Call API to generate song
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memory })
    })
    
    const data = await response.json()
    setSongData(data)
    
    // Save to local storage
    const songs = JSON.parse(localStorage.getItem('echoes_songs') || '[]')
    songs.push({ ...data, id: Date.now(), memory })
    localStorage.setItem('echoes_songs', JSON.stringify(songs))
    
    setStage('complete')
  }

  if (stage === 'analyzing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse text-4xl">🎵</div>
          <p className="text-xl">Understanding your memory...</p>
        </div>
      </div>
    )
  }

  if (stage === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">🎨</div>
          <p className="text-xl">Creating your song...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Your Memory Song</h2>
          <p className="text-gray-400">{memory}</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-lg p-8 space-y-6">
          <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-6xl mb-4">🎵</p>
              <p className="text-2xl font-bold">{songData?.title}</p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{songData?.title}</h3>
            <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-purple-500 rounded-full font-semibold hover:bg-purple-600 transition">
                ▶ Play Song
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Lyrics</h4>
            <div className="bg-black/20 rounded p-6 whitespace-pre-line text-sm">
              {songData?.lyrics}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/library')}
              className="flex-1 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              View Library
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
