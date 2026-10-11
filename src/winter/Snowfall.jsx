import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'ai-apps-winter-bootcamp:motion-field-v1'

export function useSnowPreference() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored === null ? true : stored === 'on'
    } catch {
      return true
    }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off') } catch { /* ignore */ }
  }, [enabled])

  return [enabled, setEnabled]
}

export function SnowToggle({ enabled, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`snow-toggle ${className}`}
      onClick={onToggle}
      aria-pressed={enabled}
      title={enabled ? 'Pause motion field' : 'Resume motion field'}
    >
      <span aria-hidden="true">{enabled ? '◉' : '○'}</span>
      <span className="snow-toggle-label">Field {enabled ? 'on' : 'off'}</span>
    </button>
  )
}

export default function Snowfall({ enabled = true, density = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let nodes = []
    let width = 0
    let height = 0
    const pointer = { x: -9999, y: -9999 }

    const spawn = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: -0.12 + Math.random() * 0.24,
      vy: -0.1 + Math.random() * 0.2,
      radius: 0.8 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.35,
      tone: Math.random() > 0.48 ? '142, 245, 229' : '167, 160, 255',
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
      const count = Math.round(Math.min(52, (width * height) / 26000) * density)
      nodes = Array.from({ length: Math.max(18, count) }, spawn)
    }

    const onMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)

      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy

        const dx = node.x - pointer.x
        const dy = node.y - pointer.y
        const distance = Math.hypot(dx, dy) || 1
        if (distance < 90) {
          node.x += (dx / distance) * 0.45
          node.y += (dy / distance) * 0.45
        }

        if (node.x < -10) node.x = width + 10
        if (node.x > width + 10) node.x = -10
        if (node.y < -10) node.y = height + 10
        if (node.y > height + 10) node.y = -10
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i]
          const b = nodes[j]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          if (distance > 105) continue
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(120, 210, 235, ${0.08 * (1 - distance / 105)})`
          ctx.stroke()
        }
      }

      for (const node of nodes) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${node.tone}, ${node.alpha})`
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [enabled, density])

  if (!enabled) return null
  return <canvas ref={canvasRef} className="snowfall" aria-hidden="true" />
}
