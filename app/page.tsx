'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [memory, setMemory] = useState('')
  const router = useRouter()

  const handleCreate = () => {
    if (memory.trim()) {
      router.push(`/create?memory=${encodeURIComponent(memory)}`)
    }
  }

  const examples = [
    "Late night drive after graduation",
    "My first day moving to a new city",
    "Watching the sunset with someone I loved"
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Echoes
          </h1>
          <p className="text-2xl text-gray-300">Turn memories into music</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            placeholder="Describe a memory..."
            className="w-full h-32 p-4 rounded-lg bg-white/10 backdrop-blur border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          
          <button
            onClick={handleCreate}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg hover:opacity-90 transition"
          >
            Create My Song
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Examples:</p>
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setMemory(ex)}
              className="block w-full text-left p-3 rounded bg-white/5 hover:bg-white/10 transition text-sm"
            >
              • {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
