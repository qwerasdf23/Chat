"use client"

import { useEffect, useRef } from "react"
import { useSiteTheme } from "@/components/site-theme-provider"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseAlpha: number
  alpha: number
  hueOffset: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const frameRef = useRef(0)
  const animRef = useRef<number>(0)
  const themeRef = useRef({
    hue: 195,
    range: 25,
    lightness: 0.72,
    chroma: 0.14,
    connectionColor: "oklch(0.6 0.1 195",
  })
  const { theme } = useSiteTheme()

  useEffect(() => {
    themeRef.current = {
      hue: theme.particleHueCenter,
      range: theme.particleHueRange,
      lightness: theme.particleLightness,
      chroma: theme.particleChroma,
      connectionColor: theme.connectionColor,
    }
    for (const p of particlesRef.current) {
      p.hueOffset = (Math.random() - 0.5) * theme.particleHueRange
    }
  }, [theme])

  const PARTICLE_COUNT = 90
  const CONNECTION_DIST = 130
  const MOUSE_RADIUS = 160

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const t = themeRef.current
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.08 + Math.random() * 0.15
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.2 + Math.random() * 1.8,
        baseAlpha: 0.2 + Math.random() * 0.35,
        alpha: 0.2 + Math.random() * 0.35,
        hueOffset: (Math.random() - 0.5) * t.range,
      }
    })

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onClick = (e: MouseEvent) => {
      const cx = e.clientX
      const cy = e.clientY
      for (const p of particlesRef.current) {
        const dx = p.x - cx
        const dy = p.y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 300 && dist > 0) {
          const force = (1 - dist / 300) * 1.5
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      }
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("click", onClick)

    const animate = () => {
      frameRef.current++
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const time = frameRef.current * 0.005
      const particles = particlesRef.current
      const ct = themeRef.current

      for (const p of particles) {
        const noiseX = Math.sin(p.x * 0.002 + time) * Math.cos(p.y * 0.0015 + time * 0.6)
        const noiseY = Math.cos(p.y * 0.002 + time * 0.7) * Math.sin(p.x * 0.0015 + time)
        p.vx += noiseX * 0.005
        p.vy += noiseY * 0.005

        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * 0.012
          p.vx += dx * force
          p.vy += dy * force
          p.alpha = Math.min(1, p.baseAlpha + (1 - dist / MOUSE_RADIUS) * 0.5)
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.03
        }

        p.vx *= 0.975
        p.vy *= 0.975
        p.x += p.vx
        p.y += p.vy

        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        const hue = ct.hue + p.hueOffset
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(${ct.lightness} ${ct.chroma} ${hue} / ${p.alpha})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const lineAlpha =
              (1 - dist / CONNECTION_DIST) *
              Math.min(particles[i].alpha, particles[j].alpha) *
              0.45
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `${ct.connectionColor} / ${lineAlpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("click", onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
