'use client'

import { useState } from 'react'

export default function TestPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<string | null>(null)

  const testAnalyzeMemory = async () => {
    setLoading('analyze')
    try {
      const response = await fetch('/api/analyze-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memory: 'Late night drive after graduation' })
      })
      const data = await response.json()
      setResults((prev: Record<string, any>) => ({ ...prev, analyze: data }))
      console.log('Analyze result:', data)
    } catch (error) {
      setResults((prev: Record<string, any>) => ({ ...prev, analyze: { error: String(error) } }))
    }
    setLoading(null)
  }

  const testGenerateSong = async () => {
    setLoading('generate')
    try {
      const response = await fetch('/api/generate-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: '[Verse]\nTest lyrics\n[Chorus]\nTest chorus',
          genre: 'indie pop',
          mood: 'nostalgic',
          tempo: 'slow'
        })
      })
      const data = await response.json()
      setResults((prev: Record<string, any>) => ({ ...prev, generate: data }))
      console.log('Generate result:', data)
    } catch (error) {
      setResults((prev: Record<string, any>) => ({ ...prev, generate: { error: String(error) } }))
    }
    setLoading(null)
  }

  const testMusicGenHealth = async () => {
    setLoading('health')
    try {
      const response = await fetch('http://localhost:5000/health')
      const data = await response.json()
      setResults((prev: Record<string, any>) => ({ ...prev, health: data }))
      console.log('Health result:', data)
    } catch (error) {
      setResults((prev: Record<string, any>) => ({ ...prev, health: { error: String(error) } }))
    }
    setLoading(null)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      <div className="space-y-4 max-w-4xl">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">1. Test MusicGen Health</h2>
          <button
            onClick={testMusicGenHealth}
            disabled={loading === 'health'}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading === 'health' ? 'Testing...' : 'Test Health'}
          </button>
          {results.health && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(results.health, null, 2)}
            </pre>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">2. Test Analyze Memory</h2>
          <button
            onClick={testAnalyzeMemory}
            disabled={loading === 'analyze'}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading === 'analyze' ? 'Testing...' : 'Test Analyze'}
          </button>
          {results.analyze && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(results.analyze, null, 2)}
            </pre>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">3. Test Generate Song</h2>
          <button
            onClick={testGenerateSong}
            disabled={loading === 'generate'}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading === 'generate' ? 'Testing...' : 'Test Generate'}
          </button>
          {results.generate && (
            <pre className="mt-4 bg-gray-900 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(results.generate, null, 2)}
            </pre>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h3 className="font-bold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>First, test MusicGen Health - should return status: "ok"</li>
          <li>If health fails, start MusicGen: <code className="bg-gray-900 px-2 py-1 rounded">./start-musicgen.sh</code></li>
          <li>Test Analyze Memory - should return lyrics and metadata</li>
          <li>Test Generate Song - should return audio_url</li>
        </ol>
      </div>
    </div>
  )
}
