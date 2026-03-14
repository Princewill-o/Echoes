'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Library() {
  const [songs, setSongs] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('echoes_songs') || '[]')
    setSongs(stored)
  }, [])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Your Echoes</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
          >
            + Create New
          </button>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-4">No memories yet</p>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
            >
              Create Your First Song
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-white/10 backdrop-blur rounded-lg p-6 hover:bg-white/20 transition cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-6xl">🎵</p>
                </div>
                <h3 className="font-bold text-lg mb-2">{song.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{song.memory}</p>
                <button className="mt-4 w-full py-2 bg-purple-500 rounded hover:bg-purple-600 transition">
                  ▶ Play
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
