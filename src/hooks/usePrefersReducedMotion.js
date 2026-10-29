import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(QUERY).matches),
  )
  useEffect(() => {
    const query = window.matchMedia?.(QUERY)
    if (!query) return undefined
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}
