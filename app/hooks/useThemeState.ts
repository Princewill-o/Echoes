'use client'

import { useEffect, useState } from 'react'

export function useThemeState() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('echoes-theme') || 'dark'
      setIsDark(theme === 'dark')
    }
    
    checkTheme()
    
    // Poll for theme changes
    const interval = setInterval(checkTheme, 100)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  return isDark
}
