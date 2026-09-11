import { useEffect, useRef } from 'react'

// Simplified fluid cursor inspired by ReactBits SplashCursor
export default function SplashCursor() {
  const canvasRef = useRef()
  const mouse = useRef({ x: 0, y: 0, px: 0, py: 0 })
  const splats = useRef([])
  const raf = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const COLORS = ['#c99a45', '#e7c878', '#6f1d2b', '#e9b99d', '#4d6b4a']

    const onMouseMove = (e) => {
      mouse.current.px = mouse.current.x
      mouse.current.py = mouse.current.y
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      const dx = mouse.current.x - mouse.current.px
      const dy = mouse.current.y - mouse.current.py
      const vel = Math.sqrt(dx * dx + dy * dy)

      if (vel > 3) {
        for (let i = 0; i < 3; i++) {
          splats.current.push({
            x: mouse.current.x + (Math.random() - 0.5) * 10,
            y: mouse.current.y + (Math.random() - 0.5) * 10,
            vx: dx * 0.3 + (Math.random() - 0.5) * 3,
            vy: dy * 0.3 + (Math.random() - 0.5) * 3,
            r: 3 + Math.random() * 8,
            alpha: 0.8 + Math.random() * 0.2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 0,
            maxLife: 30 + Math.random() * 40,
          })
        }
      }
    }

    const onMouseDown = (e) => {
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2
        const speed = 2 + Math.random() * 5
        splats.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 4 + Math.random() * 10,
          alpha: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          life: 0,
          maxLife: 40 + Math.random() * 30,
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      splats.current = splats.current.filter(s => {
        s.life++
        s.x += s.vx
        s.y += s.vy
        s.vx *= 0.95
        s.vy *= 0.95
        s.r *= 0.97
        s.alpha = (1 - s.life / s.maxLife) * 0.8

        if (s.life >= s.maxLife || s.r < 0.5) return false

        ctx.save()
        ctx.globalAlpha = s.alpha
        ctx.fillStyle = s.color
        ctx.shadowBlur = s.r * 2
        ctx.shadowColor = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
        return true
      })

      // Main cursor dot
      ctx.save()
      ctx.globalAlpha = 0.9
      ctx.fillStyle = '#e7c878'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#e7c878'
      ctx.beginPath()
      ctx.arc(mouse.current.x, mouse.current.y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      raf.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}
    />
  )
}
