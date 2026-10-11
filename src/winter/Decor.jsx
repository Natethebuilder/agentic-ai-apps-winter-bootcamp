const BASE = import.meta.env.BASE_URL

export function Mascot({ className = '' }) {
  return (
    <span className={`mascot mascot-copilot ${className}`}>
      <img src={`${BASE}copilot-mascot.png`} alt="" className="mascot-img" />
    </span>
  )
}

export function Logos({ className = '', size = 'md' }) {
  return (
    <div className={`logos logos-${size} ${className}`}>
      <img src={`${BASE}logos/microsoft-mark.svg`} alt="Microsoft" />
      <span className="logos-divider" />
      <img src={`${BASE}logos/github-mark.svg`} alt="GitHub" className="logo-github" />
    </div>
  )
}

export function Snowflake({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
      <path d="m9 4 3 2 3-2M9 20l3-2 3 2M4.5 10.5 5 7l-3.2-1M19.5 13.5 19 17l3.2 1M4.5 13.5 5 17l-3.2 1M19.5 10.5 19 7l3.2-1" />
    </svg>
  )
}
