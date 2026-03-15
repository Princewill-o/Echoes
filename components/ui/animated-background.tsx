'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface AnimatedBackgroundProps {
  children?: React.ReactNode
  className?: string
  particleCount?: number
  baseHue?: number
}

export function AnimatedBackground({
  children,
  className = '',
  particleCount = 500,
  baseHue = 280
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDark, setIsDark] = useState(true)

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = localStorage.getItem('echoes-theme') || 'dark'
      setIsDark(theme === 'dark')
    }
    
    checkTheme()
    
    // Listen for storage changes (theme toggle in other components)
    window.addEventListener('storage', checkTheme)
    
    // Poll for theme changes (since localStorage doesn't trigger storage event in same tab)
    const interval = setInterval(checkTheme, 100)
    
    return () => {
      window.removeEventListener('storage', checkTheme)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      hue: number
      size: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 2
        this.vy = (Math.random() - 0.5) * 2
        this.life = 0
        this.maxLife = 50 + Math.random() * 100
        this.hue = baseHue + Math.random() * 60
        this.size = 1 + Math.random() * 2
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.life++

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life > this.maxLife) {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.life = 0
        }
      }

      draw() {
        if (!ctx) return
        const opacity = 1 - this.life / this.maxLife
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${opacity * 0.6})`
        ctx.fill()
      }
    }

    const init = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      // Use different background colors for dark/light mode
      if (isDark) {
        ctx.fillStyle = 'rgba(4, 2, 11, 0.1)'
      } else {
        ctx.fillStyle = 'rgba(248, 250, 252, 0.15)'
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    init()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, baseHue, isDark])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 transition-colors duration-300"
        style={{ 
          background: isDark ? '#04020b' : '#f8fafc'
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  )
}
