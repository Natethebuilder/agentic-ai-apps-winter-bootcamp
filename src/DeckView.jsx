import { InlineEditProvider, Navigation, SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import '@deckio/deck-engine/styles/editable.css'
import project from '../deck.config.js'
import { useRef } from 'react'
import { ChristmasLights, Mascot } from './winter/Decor.jsx'
import { TeamSlide } from './slides/WinterSlides.jsx'

function FloatingCopilot() {
  const { current, totalSlides } = useSlides()
  if (current <= 0 || current === totalSlides - 1) return null
  // On laptop-sized screens the mascot would cover the text of the last team card.
  if (project.slides[current] === TeamSlide) return null
  return <Mascot className="floating-copilot" />
}

const LIGHTS = 34

// One persistent light string for the whole deck, so it fills up instead of fading with each slide.
function DeckLights() {
  const { current, totalSlides, visibleIndices = [] } = useSlides()
  const order = visibleIndices.length ? visibleIndices : Array.from({ length: totalSlides }, (_, i) => i)
  const pos = Math.max(0, order.indexOf(current))
  const lit = Math.round(((pos + 1) / order.length) * LIGHTS)
  const prev = useRef({ pos, lit, from: 0 })
  if (prev.current.pos !== pos) {
    prev.current = { pos, lit, from: Math.min(prev.current.lit, lit) }
  }
  return (
    <ChristmasLights
      count={LIGHTS}
      className="deck-lights"
      lit={lit}
      prevLit={prev.current.from}
      complete={pos === order.length - 1}
    />
  )
}

export default function DeckView() {
  const { id, slides, theme } = project
  return (
    <InlineEditProvider overrides={{}} project={id}>
      <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
        <div className="deck-chrome">
          <a className="deck-home-link" href="#/">← Website</a>
        </div>
        <Navigation />
        <DeckLights />
        <div className="deck" data-project-id={id}>
          {slides.map((SlideComponent, index) => (
            <SlideErrorBoundary key={`${id}-slide-${index}`} index={index}>
              <SlideComponent index={index} project={project} />
            </SlideErrorBoundary>
          ))}
        </div>
        <FloatingCopilot />
      </SlideProvider>
    </InlineEditProvider>
  )
}
