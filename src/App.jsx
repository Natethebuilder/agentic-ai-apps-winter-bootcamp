import { useEffect, useState } from 'react'
import DeckView from './DeckView.jsx'
import Site from './site/Site.jsx'
import Snowfall, { useSnowPreference } from './winter/Snowfall.jsx'
import project from '../deck.config.js'

function useHashRoute() {
  const read = () => (window.location.hash.startsWith('#/deck') ? 'deck' : 'site')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onHash = () => setRoute(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

export default function App() {
  const route = useHashRoute()
  const [snow, setSnow] = useSnowPreference()
  const toggleSnow = () => setSnow((v) => !v)

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', project.accent)
    document.title = route === 'deck' ? `${project.title} · Deck` : project.title
  }, [route])

  return (
    <>
      <Snowfall enabled={snow} density={route === 'deck' ? 0.6 : 1} />
      {route === 'deck'
        ? <DeckView snow={snow} onToggleSnow={toggleSnow} />
        : <Site snow={snow} onToggleSnow={toggleSnow} />}
    </>
  )
}
