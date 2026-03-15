'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Music, Play, Pause, Sparkles, Heart } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { useThemeState } from '../hooks/useThemeState'

interface Message {
  role: 'user' | 'assistant'
  content: string
  showSongPlayer?: boolean
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const [hasAskedName, setHasAskedName] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isDark = useThemeState()
  const router = useRouter()

  useEffect(() => {
    // Initial greeting
    setMessages([{
      role: 'assistant',
      content: "Hey there! 👋 I'm your music buddy. I'm here to listen and cheer you up. How are you feeling today?"
    }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize audio for the custom song
  useEffect(() => {
    // You'll add your MP3 file path here
    const audio = new Audio('/audio/menace-song.mp3')
    audio.addEventListener('ended', () => setIsPlaying(false))
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    setAudioElement(audio)
    
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const togglePlay = () => {
    if (!audioElement) return
    
    if (isPlaying) {
      audioElement.pause()
    } else {
      audioElement.play()
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // Check if we need to ask for name
      if (!hasAskedName && !userName) {
        setHasAskedName(true)
        
        // Simple name extraction
        const nameMatch = userMessage.match(/(?:i'm|i am|my name is|call me)\s+(\w+)/i)
        if (nameMatch) {
          const extractedName = nameMatch[1]
          setUserName(extractedName)
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `That's a lovely name, ${extractedName}! 🎵 You know what? I've created something special just for you. I made a song that captures your vibe! Want to hear it?`,
              showSongPlayer: true
            }])
            setIsLoading(false)
          }, 1000)
          return
        }
      }

      // Call GitHub AI for response
      const response = await fetch('/api/chat-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          userName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      // Check if AI wants to ask for name
      const shouldAskName = !userName && !hasAskedName && data.askForName
      
      if (shouldAskName) {
        setHasAskedName(true)
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        showSongPlayer: data.showSong
      }])

    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I'm having trouble connecting right now. But I'm still here for you! 💙"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <Sidebar />
      <div className={`min-h-screen relative pl-[60px] md:pl-56 transition-colors duration-300 ${
        isDark ? 'bg-[#04020b]' : 'bg-slate-50'
      }`}>
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className={`p-6 border-b backdrop-blur-xl ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Thoughts & Personal Buddy</h1>
                    <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Your personal cheerleader & song creator</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <span className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Personal Buddy</span>
                        </div>
                      )}
                      
                      <div className={`rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white'
                          : isDark
                          ? 'bg-white/[0.05] border-2 border-white/[0.08] text-white/90'
                          : 'bg-white/80 border-2 border-slate-200 text-slate-900'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        
                        {message.showSongPlayer && (
                          <div className={`mt-4 p-4 rounded-xl border-2 ${
                            isDark 
                              ? 'bg-black/20 border-white/10' 
                              : 'bg-slate-50 border-slate-200'
                          }`}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                                <img 
                                  src="/audio/menace.png" 
                                  alt="Song Cover"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to gradient if image not found
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-purple-500', 'to-pink-500')
                                    const icon = document.createElement('div')
                                    icon.innerHTML = '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>'
                                    e.currentTarget.parentElement!.appendChild(icon)
                                    e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center')
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {userName ? `${userName}'s Song` : 'Your Special Song'}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Made just for you 💜</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={togglePlay}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 rounded-xl transition-all text-white font-bold shadow-lg"
                            >
                              {isPlaying ? (
                                <>
                                  <Pause className="w-4 h-4" />
                                  Pause Song
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  Play Song
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          <span className={`text-xs font-bold ${isDark ? 'text-white/60' : 'text-slate-600'}`}>You</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/[0.05] border-2 border-white/[0.08]' : 'bg-white/80 border-2 border-slate-200'}`}>
                      <div className="flex gap-2">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/40' : 'bg-slate-400'}`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/40' : 'bg-slate-400'}`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/40' : 'bg-slate-400'}`} style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className={`p-6 border-t backdrop-blur-xl ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share how you're feeling..."
                    className={`flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none transition-all ${
                      isDark
                        ? 'bg-white/[0.05] border-white/[0.08] text-white placeholder-white/40 focus:border-fuchsia-400/50'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-fuchsia-400'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all text-white font-bold shadow-lg flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}
