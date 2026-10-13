const BASE = import.meta.env.BASE_URL

export function Mascot({ className = '' }) {
  return (
    <span className={`mascot mascot-copilot ${className}`}>
      <img src={`${BASE}copilot-mascot.png`} alt="" className="mascot-img" />
    </span>
  )
}

export function FoundryMark({ className = '' }) {
  return <img src={`${BASE}logos/foundry.svg`} alt="Microsoft Foundry" className={`foundry-mark ${className}`} />
}

export function AgentGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" role="img" aria-label="Agent orchestration">
      <path d="M8 9.5 16 5l8 4.5v9L16 23l-8-4.5z" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="9.5" r="2.6" fill="currentColor" />
      <circle cx="24" cy="9.5" r="2.6" fill="currentColor" />
      <circle cx="16" cy="23" r="2.6" fill="currentColor" />
      <circle cx="16" cy="14" r="4" fill="currentColor" opacity=".7" />
    </svg>
  )
}

export function Logos({ className = '', size = 'md' }) {
  return (
    <div className={`logos logos-${size} ${className}`}>
      <img src={`${BASE}logos/microsoft-mark.svg`} alt="Microsoft" />
      <span className="logos-divider" />
      <FoundryMark />
      <span className="logos-divider" />
      <img src={`${BASE}logos/github-mark.svg`} alt="GitHub" className="logo-github" />
    </div>
  )
}
