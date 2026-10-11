import { InlineEditProvider, Navigation, SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import '@deckio/deck-engine/styles/editable.css'
import { useRef } from 'react'
import project from '../deck.config.js'
import { MotionToggle } from './theme/AuroraField.jsx'

const SEGMENTS = 28

function DeckProgress() {
  const { current, totalSlides, visibleIndices = [] } = useSlides()
  const order = visibleIndices.length ? visibleIndices : Array.from({ length: totalSlides }, (_, index) => index)
  const position = Math.max(0, order.indexOf(current))
  const activeSegments = Math.round(((position + 1) / order.length) * SEGMENTS)
  const previous = useRef(activeSegments)
  const priorSegments = previous.current
  previous.current = activeSegments

  return (
    <div className="deck-progress" aria-hidden="true">
      {Array.from({ length: SEGMENTS }, (_, index) => (
        <i
          key={index}
          className={index < activeSegments ? 'is-active' : ''}
          style={{ '--delay': `${Math.max(0, index - priorSegments) * 28}ms` }}
        />
      ))}
    </div>
  )
}

export default function DeckView({ motion, onToggleMotion }) {
  const { id, slides, theme } = project

  return (
    <InlineEditProvider overrides={{}} project={id}>
      <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
        <div className="deck-chrome">
          <a href="#/">← Website</a>
          <MotionToggle enabled={motion} onToggle={onToggleMotion} />
        </div>
        <Navigation />
        <DeckProgress />
        <div className="deck" data-project-id={id}>
          {slides.map((SlideComponent, index) => (
            <SlideErrorBoundary key={`${id}-slide-${index}`} index={index}>
              <SlideComponent index={index} project={project} />
            </SlideErrorBoundary>
          ))}
        </div>
      </SlideProvider>
    </InlineEditProvider>
  )
}
