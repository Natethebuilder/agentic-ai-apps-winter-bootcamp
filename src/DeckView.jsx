import { InlineEditProvider, Navigation, SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import '@deckio/deck-engine/styles/editable.css'
import { useEffect, useRef, useState } from 'react'
import project from '../deck.config.js'
import RegistrationForm from './registration/RegistrationForm.jsx'
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
  const [registrationOpen, setRegistrationOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('deckRegister') !== '1') return

    setRegistrationOpen(true)
    params.delete('deckRegister')
    const query = params.toString()
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}#/deck`)
  }, [])

  return (
    <InlineEditProvider overrides={{}} project={id}>
      <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme} mode="present">
        <div className="deck-chrome">
          <a href="#/">← Website</a>
          <div>
            <MotionToggle enabled={motion} onToggle={onToggleMotion} />
          </div>
        </div>
        <Navigation />
        <DeckProgress />
        <div className="deck" data-project-id={id}>
          {slides.map((SlideComponent, index) => (
            <SlideErrorBoundary key={`${id}-slide-${index}`} index={index}>
              <SlideComponent index={index} project={project} onOpenRegistration={() => setRegistrationOpen(true)} />
            </SlideErrorBoundary>
          ))}
        </div>
        {registrationOpen && (
          <div className="deck-modal-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) setRegistrationOpen(false)
          }}>
            <section className="deck-registration-modal" role="dialog" aria-modal="true" aria-labelledby="deck-registration-title">
              <header>
                <div>
                  <span>Registration</span>
                  <h2 id="deck-registration-title">Reserve your place.</h2>
                </div>
                <button type="button" onClick={() => setRegistrationOpen(false)} aria-label="Close registration">Close</button>
              </header>
              <RegistrationForm postLoginRedirect="/?deckRegister=1#/deck" />
            </section>
          </div>
        )}
      </SlideProvider>
    </InlineEditProvider>
  )
}
