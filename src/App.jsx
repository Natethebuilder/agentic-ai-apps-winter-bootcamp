import { useEffect, useState } from 'react'
import project from '../deck.config.js'
import DeckView from './DeckView.jsx'
import Site from './site/Site.jsx'
import AuroraField, { useMotionPreference } from './theme/AuroraField.jsx'

function useHashRoute() {
  const readRoute = () => (window.location.hash.startsWith('#/deck') ? 'deck' : 'site')
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return route
}

export default function App() {
  const route = useHashRoute()
  const [motion, setMotion] = useMotionPreference()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', project.accent)
    document.title = route === 'deck' ? `${project.title} · Deck` : project.title
  }, [route])

  return (
    <>
      <AuroraField enabled={motion} density={route === 'deck' ? 0.65 : 1} />
      {route === 'deck'
        ? <DeckView motion={motion} onToggleMotion={() => setMotion((value) => !value)} />
        : <Site motion={motion} onToggleMotion={() => setMotion((value) => !value)} />}
    </>
  )
}
