import { useId } from 'react'
import { SESSIONS } from '../content.js'
import a from './Agentic.module.css'

const ACCENTS = SESSIONS.map((session) => session.accent)

const polar = (cx, cy, r, deg) => {
  const rad = (deg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

// Pointy-top hexagon, the shape used for agents and the Foundry core throughout the site.
const hex = (cx, cy, r) =>
  Array.from({ length: 6 }, (_, k) => polar(cx, cy, r, 60 * k - 90).map((n) => n.toFixed(2)).join(',')).join(' ')

const RING = Array.from({ length: 6 }, (_, k) => polar(32, 32, 22, 60 * k - 90))
const CELLS = [-120, -60, 0, 60, 120, 180].map((deg) => polar(32, 32, 16.3, deg))

// An agent orbits the six lifecycle stages; each stage lights up as the agent reaches it.
function LifecycleGlyph() {
  const gradient = `trail-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg viewBox="0 0 64 64" className={a.svg} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} gradientUnits="userSpaceOnUse" x1="12.95" y1="21" x2="32" y2="10">
          <stop offset="0" className={a.trailFrom} />
          <stop offset="1" className={a.trailTo} />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" className={a.track} />
      <g className={a.orbit}>
        <path d="M12.95 21 A22 22 0 0 1 32 10" className={a.trail} stroke={`url(#${gradient})`} />
        <circle cx="32" cy="10" r="2.6" className={a.head} />
      </g>
      {RING.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="3.6" className={a.stage} style={{ '--node': ACCENTS[k], '--k': k }} />
      ))}
      <polygon points={hex(32, 32, 9)} className={a.core} />
      <circle cx="32" cy="32" r="2.6" className={a.coreDot} />
    </svg>
  )
}

// Six self-contained session cells around the programme core. They light up in order and stay lit,
// because each session also builds on the last.
function StandaloneGlyph() {
  return (
    <svg viewBox="0 0 64 64" className={a.svg} aria-hidden="true" focusable="false">
      {CELLS.map(([x, y], k) => (
        <polygon key={k} points={hex(x, y, 8.4)} className={a.cell} style={{ '--node': ACCENTS[k], '--k': k }} />
      ))}
      <polygon points={hex(32, 32, 8.4)} className={a.hub} />
      <polygon points={hex(32, 32, 3.3)} className={a.hubCore} />
    </svg>
  )
}

// Concept, then Foundry, then your own hands-on build: a packet climbs through the three steps.
function HandsOnGlyph() {
  return (
    <svg viewBox="0 0 64 64" className={a.svg} aria-hidden="true" focusable="false">
      <path d="M18.5 42.66 L25.56 37.08 M38.44 26.92 L43.5 22.92" className={a.link} />
      <circle cx="13" cy="47" r="2.6" className={a.packet} />
      <circle cx="13" cy="47" r="7" className={`${a.step} ${a.stepLearn}`} />
      <circle cx="13" cy="47" r="2.2" className={a.stepDot} />
      <polygon points={hex(32, 32, 9)} className={`${a.step} ${a.stepSee}`} />
      <polygon points={hex(32, 32, 3.4)} className={a.stepDot} />
      <rect x="43.5" y="9.5" width="15" height="15" rx="3.6" className={`${a.step} ${a.stepBuild}`} />
      <path d="M47.4 13.6 L50.4 16.5 L47.4 19.4" className={a.prompt} />
      <rect x="51.6" y="18.6" width="4" height="1.6" rx="0.7" className={a.cursor} />
    </svg>
  )
}

const GLYPHS = { lifecycle: LifecycleGlyph, standalone: StandaloneGlyph, handson: HandsOnGlyph }

export default function PillarMark({ id, tag, size = 'md', className = '' }) {
  const Glyph = GLYPHS[id] ?? LifecycleGlyph
  return (
    <div className={`${a.mark} ${size === 'sm' ? a.sm : ''} ${className}`}>
      <span className={a.tile}><Glyph /></span>
      {tag && <span className={a.tag}>{tag}</span>}
    </div>
  )
}
