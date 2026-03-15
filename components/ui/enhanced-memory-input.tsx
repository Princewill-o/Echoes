'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Sparkles, Send } from 'lucide-react'

const PLACEHOLDERS = [
  "I watched the sunset from my rooftop with my best friend...",
  "The day I moved to a new city and felt both scared and excited...",
  "Dancing in the rain without a care in the world...",
  "That quiet morning coffee that changed everything...",
  "The moment I realized I was exactly where I needed to be...",
  "Laughing until my stomach hurt with people I love...",
]

interface EnhancedMemoryInputProps {
  onSubmit: (memory: string) => void
  className?: string
}

export function EnhancedMemoryInput({ onSubmit, className = '' }: EnhancedMemoryInputProps) {
  const [memory, setMemory] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (isFocused || memory) return
    
    const interval = setInterval(() => {
      setShowPlaceholder(false)
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
        setShowPlaceholder(true)
      }, 400)
    }, 4000)

    return () => clearInterval(interval)
  }, [isFocused, memory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (memory.trim()) {
      onSubmit(memory)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`w-full max-w-3xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="relative bg-white/[0.03] backdrop-blur-xl border-2 border-white/[0.08] rounded-3xl overflow-hidden transition-all duration-300 hover:border-fuchsia-400/30 focus-within:border-fuchsia-400/50 focus-within:shadow-2xl focus-within:shadow-fuchsia-900/20">
          <div className="flex items-start gap-3 p-4">
            <div className="flex-shrink-0 mt-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center border border-white/10">
                <Sparkles className="w-5 h-5 text-fuchsia-400" />
              </div>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-0 outline-none text-white text-base resize-none min-h-[80px] placeholder-transparent"
                maxLength={500}
                rows={3}
              />
              
              {!memory && !isFocused && (
                <div className="absolute inset-0 pointer-events-none">
                  <AnimatePresence mode="wait">
                    {showPlaceholder && (
                      <motion.div
                        key={placeholderIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-white/30 text-base"
                      >
                        {PLACEHOLDERS[placeholderIndex]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-white/[0.05]">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Music className="w-3 h-3" />
              <span>{memory.length}/500</span>
            </div>
            
            <motion.button
              type="submit"
              disabled={!memory.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-lg shadow-fuchsia-900/40 border border-white/10 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Create Song</span>
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.form>
  )
}
