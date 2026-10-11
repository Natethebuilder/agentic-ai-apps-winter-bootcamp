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
