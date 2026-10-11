import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ai-apps-winter-motion'

export function useMotionPreference() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === null ? true : saved === 'on'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  }, [enabled])

  return [enabled, setEnabled]
}

export function MotionToggle({ enabled, onToggle }) {
  return (
    <button className="motion-toggle" type="button" onClick={onToggle} aria-pressed={enabled}>
      <span aria-hidden="true">{enabled ? '◉' : '○'}</span>
      Motion {enabled ? 'on' : 'off'}
    </button>
  )
}

export default function AuroraField({ enabled, density = 1 }) {
  const nodes = useMemo(() => Array.from({ length: Math.round(22 * density) }, (_, index) => ({
    id: index,
    x: (index * 37) % 101,
    y: (index * 53) % 97,
    delay: `${(index % 9) * -0.8}s`,
    duration: `${7 + (index % 5) * 1.7}s`,
  })), [density])

  return (
    <div className={`aurora-field ${enabled ? 'is-moving' : ''}`} aria-hidden="true">
      <div className="aurora-ribbon aurora-ribbon-one" />
      <div className="aurora-ribbon aurora-ribbon-two" />
      <svg className="constellation" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M-5 78 C18 58 28 84 48 56 S78 28 105 38" />
        <path d="M-4 28 C20 48 36 12 58 35 S82 78 104 64" />
      </svg>
      {nodes.map((node) => (
        <i
          key={node.id}
          className="field-node"
          style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: node.delay, animationDuration: node.duration }}
        />
      ))}
    </div>
  )
}
