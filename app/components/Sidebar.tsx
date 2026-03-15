'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Music, Home, Library as LibraryIcon, Settings, Plus, Sun, Moon } from 'lucide-react'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(true)
  const [userSongs, setUserSongs] = useState<any[]>([])

  useEffect(() => {
    const savedTheme = localStorage.getItem('echoes-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('echoes-theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('echoes_songs') || '[]')
    setUserSongs(stored)
  }, [pathname])

  const toggleTheme = () => setIsDark(prev => !prev)

  const NAV_ITEMS = [
    { id: '/', icon: Home, label: 'Home', color: 'text-violet-400', active: 'bg-violet-500/20 text-violet-200 border border-violet-500/30' },
    { id: '/library', icon: LibraryIcon, label: 'Library', color: 'text-sky-400', active: 'bg-sky-500/20 text-sky-200 border border-sky-500/30' },
    { id: '/chat', icon: Music, label: 'Thoughts Buddy', color: 'text-pink-400', active: 'bg-pink-500/20 text-pink-200 border border-pink-500/30' }
  ]

  return (
    <nav className={`fixed left-0 top-0 bottom-0 w-[60px] md:w-56 border-r-2 z-50 flex flex-col items-center md:items-start py-5 px-2 md:px-4 backdrop-blur-2xl transition-colors duration-300 ${
      isDark 
        ? 'bg-[#0a0618]/98 border-white/[0.06]' 
        : 'bg-white/90 border-slate-200/80'
    }`}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-7 cursor-pointer px-1" onClick={() => router.push('/')}>
        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-900/50 flex-shrink-0 border-2 border-white/10">
          <Music className="w-4 h-4 text-white" />
        </div>
        <h1 className={`text-lg font-black tracking-tight hidden md:block ${
          isDark 
            ? 'bg-gradient-to-r from-white via-fuchsia-200 to-violet-300 bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent'
        }`}>
          Echoes
        </h1>
      </div>

      {/* Create Button */}
      <button 
        onClick={() => router.push('/')}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white font-black text-xs mb-6 hover:from-violet-500 hover:to-pink-500 transition-all shadow-lg shadow-fuchsia-900/40 border-2 border-white/10"
      >
        <Plus className="w-4 h-4 flex-shrink-0" />
        <span className="hidden md:block">New Memory</span>
      </button>

      {/* Nav Links */}
      <div className="space-y-1 w-full">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => router.push(item.id)}
            className={`flex items-center gap-3 w-full px-2 py-2.5 rounded-xl transition-all text-xs font-bold ${
              pathname === item.id ? item.active : `${item.color} opacity-60 hover:opacity-100 hover:bg-white/5`
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Recent */}
      <div className="mt-6 w-full hidden md:block">
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-3 px-2 ${isDark ? 'text-white/25' : 'text-slate-400'}`}>Recent</p>
        <div className="space-y-1">
          {userSongs.length > 0 ? (
            userSongs.slice(0, 3).map(song => (
              <div
                key={song.id}
                className={`group cursor-pointer flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all border border-transparent ${
                  isDark ? 'hover:bg-white/5 hover:border-white/10' : 'hover:bg-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                  {song.coverUrl ? (
                    <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-3 h-3 text-purple-400" />
                  )}
                </div>
                <span className={`text-[11px] truncate transition-colors font-semibold ${isDark ? 'text-white/30 group-hover:text-white/80' : 'text-slate-500 group-hover:text-slate-800'}`}>{song.title || 'Untitled'}</span>
              </div>
            ))
          ) : (
            <p className={`text-[10px] px-2 ${isDark ? 'text-white/20' : 'text-slate-400'}`}>No songs yet</p>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className={`mt-auto w-full pt-4 border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
        <button 
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-2 py-2.5 rounded-xl transition-all text-xs font-bold mb-1 ${
            isDark ? 'text-white/25 hover:bg-white/5 hover:text-white/60' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4 flex-shrink-0 text-amber-400" /> : <Moon className="w-4 h-4 flex-shrink-0 text-violet-500" />}
          <span className="hidden md:block">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className={`flex items-center gap-3 w-full px-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
          isDark ? 'text-white/25 hover:bg-white/5 hover:text-white/60' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
        }`}>
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="hidden md:block">Settings</span>
        </button>
      </div>
    </nav>
  )
}
