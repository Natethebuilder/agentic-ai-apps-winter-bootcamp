import { InlineEditProvider, Navigation, SlideErrorBoundary, SlideProvider, useSlides } from '@deckio/deck-engine'
import '@deckio/deck-engine/styles/editable.css'
import project from '../deck.config.js'
import { Mascot } from './winter/Decor.jsx'

function FloatingCopilot() {
  const { current, totalSlides } = useSlides()
  if (current <= 0 || current === totalSlides - 1) return null
  return <Mascot className="floating-copilot" />
}

function DeliveryProgress() {
  const { current, totalSlides, visibleIndices = [] } = useSlides()
  const order = visibleIndices.length ? visibleIndices : Array.from({ length: totalSlides }, (_, i) => i)
  const pos = Math.max(0, order.indexOf(current))
  const progress = ((pos + 1) / order.length) * 100
  return (
    <div className="deck-delivery-progress" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
      {Array.from({ length: 6 }, (_, index) => <i key={index} className={progress >= ((index + 1) / 6) * 100 ? 'is-complete' : ''} />)}
    </div>
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
        <DeliveryProgress />
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
