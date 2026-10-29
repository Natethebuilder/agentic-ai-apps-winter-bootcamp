import { useState } from 'react'

const BASE = import.meta.env.BASE_URL

// Decorative headshot: the person's name is always rendered next to it, so it is hidden from
// assistive tech. Falls back to initials when there is no photo or it fails to load.
export default function SpeakerAvatar({ person, className = '', style }) {
  const [failed, setFailed] = useState(false)
  const photo = !failed && person?.photo
  return (
    <span className={className} style={style} aria-hidden="true">
      {photo
        ? <img src={`${BASE}${photo}`} alt="" draggable={false} onError={() => setFailed(true)} />
        : person?.initials}
    </span>
  )
}
