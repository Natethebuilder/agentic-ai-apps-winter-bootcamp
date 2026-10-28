import { useEffect, useRef, useState } from 'react'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return undefined
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export default function Snowfall({ enabled = true, density = 1 }) {
  const canvasRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const active = enabled && !reducedMotion

  useEffect(() => {
    if (!active) return undefined
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let flakes = []
    let width = 0
    let height = 0
    const pointer = { x: -9999, y: -9999 }

    const spawn = (anywhere) => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -10,
      r: 0.7 + Math.random() * 2.2,
      vy: 0.3 + Math.random() * 0.9,
      vx: -0.3 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.3 + Math.random() * 0.5,
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(115, (width * height) / 16500) * density)
      flakes = Array.from({ length: count }, () => spawn(true))
    }

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }

    const tick = (t) => {
      ctx.clearRect(0, 0, width, height)
      for (const f of flakes) {
        f.y += f.vy
        f.x += f.vx + Math.sin(t / 1400 + f.phase) * 0.35
        // Flakes drift away from the cursor.
        const dx = f.x - pointer.x
        const dy = f.y - pointer.y
        const dist = Math.hypot(dx, dy) || 1
        if (dist < 90) {
          f.x += (dx / dist) * 1.6
          f.y += (dy / dist) * 0.6
        }
        if (f.y > height + 10 || f.x < -20 || f.x > width + 20) Object.assign(f, spawn(false))
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(240, 237, 255, ${f.alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active, density])

  if (!active) return null
  return <canvas ref={canvasRef} className="snowfall" aria-hidden="true" />
}
