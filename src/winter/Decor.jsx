const BASE = import.meta.env.BASE_URL

// Magenta rather than red so it reads against the purple Copilot mascot in the Foundry palette.
export function SantaHat({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 90" aria-hidden="true">
      <defs>
        <linearGradient id="santa-hat-fill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ff7fcb" />
          <stop offset="1" stopColor="#b61f86" />
        </linearGradient>
      </defs>
      <path d="M14 70 C 26 30, 60 6, 96 22 C 104 26, 108 40, 104 52 L 92 48 C 90 36, 80 30, 70 32 C 52 36, 40 52, 34 70 Z" fill="url(#santa-hat-fill)" />
      <rect x="6" y="62" width="92" height="20" rx="10" fill="#f6f5ff" />
      <circle cx="104" cy="56" r="11" fill="#f6f5ff" />
    </svg>
  )
}

export function Mascot({ kind = 'copilot', className = '', hat = true }) {
  const src = kind === 'duck' ? `${BASE}mascot-duck.png` : `${BASE}copilot-mascot.png`
  return (
    <span className={`mascot mascot-${kind} ${className}`}>
      <img src={src} alt="" className="mascot-img" />
      {hat && <SantaHat className="mascot-hat" />}
    </span>
  )
}

// `lit` / `prevLit` turn the string into a progress bar: bulbs below `prevLit` are on,
// bulbs from `prevLit` to `lit` flicker on in sequence, the rest stay dark.
export function ChristmasLights({ count = 28, className = '', lit = count, prevLit = lit, complete = false }) {
  return (
    <div className={`xmas-lights ${complete ? 'lights-complete' : ''} ${className}`} aria-hidden="true">
      <svg className="xmas-wire" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0 2 Q 2.5 8 5 2 T 10 2 T 15 2 T 20 2 T 25 2 T 30 2 T 35 2 T 40 2 T 45 2 T 50 2 T 55 2 T 60 2 T 65 2 T 70 2 T 75 2 T 80 2 T 85 2 T 90 2 T 95 2 T 100 2" />
      </svg>
      <ul>
        {Array.from({ length: count }, (_, i) => {
          const state = i >= lit ? 'bulb-off' : i >= prevLit ? 'bulb-new' : ''
          return (
            <li
              key={i}
              className={`bulb bulb-${i % 4} ${state}`}
              style={{ '--n': i, '--k': Math.max(0, i - prevLit) }}
            />
          )
        })}
      </ul>
    </div>
  )
}

export function FoundryMark({ className = '' }) {
  return <img src={`${BASE}logos/foundry.svg`} alt="Microsoft Foundry" className={`foundry-mark ${className}`} />
}

export function Logos({ className = '', size = 'md' }) {
  return (
    <div className={`logos logos-${size} ${className}`}>
      <img src={`${BASE}logos/microsoft-mark.svg`} alt="Microsoft" />
      <span className="logos-divider" />
      <img src={`${BASE}logos/github-mark.svg`} alt="GitHub" className="logo-github" />
      <span className="logos-divider" />
      <FoundryMark />
    </div>
  )
}
