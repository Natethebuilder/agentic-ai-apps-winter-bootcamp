import { Slide, useSlides } from '@deckio/deck-engine'
import { EVENT, SESSIONS, VALUE } from '../content.js'
import RegistrationForm from '../registration/RegistrationForm.jsx'
import { AgentWorkbench, BuildLoop, EvaluationConsole, ModelWorkbench } from '../viz/FoundryLab.jsx'

function SlideShell({ index, eyebrow, title, children, className = '' }) {
  const { current } = useSlides()
  const active = current === index

  return (
    <Slide index={index} className={`presentation-slide ${className} ${active ? 'is-active' : ''}`}>
      <header className="slide-header">
        <span>{eyebrow}</span>
        <i />
        <small>Agentic AI Apps · Winter Bootcamp</small>
      </header>
      {title && <h2 className="slide-title">{title}</h2>}
      <div className="slide-body">{children}</div>
      <footer className="slide-footer">
        <span>Programme skeleton · details TBC</span>
        <strong>{String(index + 1).padStart(2, '0')}</strong>
      </footer>
    </Slide>
  )
}

export function TitleSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Community learning series" className="title-slide">
      <div className="deck-title-lockup">
        <span className="deck-kicker">Six sessions · online · dates TBC</span>
        <h1>Build agents that work beyond the <em>demo.</em></h1>
        <p>{EVENT.summary}</p>
        <div>
          <span>Models</span><i /><span>Tools</span><i /><span>Agents</span><i /><span>Evaluation</span>
        </div>
      </div>
      <div className="deck-core" aria-hidden="true">
        <i className="ring-one" /><i className="ring-two" />
        <strong>AGENT</strong>
      </div>
    </SlideShell>
  )
}

export function AudienceSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Who it is for" title="A wider community of agent builders." className="audience-slide">
      <div className="slide-card-grid three-up">
        {VALUE.map((item) => (
          <article key={item.number}>
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <p className="slide-callout">{EVENT.audience}</p>
    </SlideShell>
  )
}

export function FormatSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Series format" title="The container is ready. The programme remains open.">
      <div className="format-layout">
        <div className="format-number"><strong>6</strong><span>community sessions</span></div>
        <div className="format-details">
          <article><span>When</span><strong>{EVENT.date}</strong></article>
          <article><span>Where</span><strong>{EVENT.format}</strong></article>
          <article><span>Programme</span><strong>Topics and speakers TBC</strong></article>
          <article><span>Registration</span><strong>Open for early interest</strong></article>
        </div>
      </div>
    </SlideShell>
  )
}

export function BuildLoopSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Agent architecture" title="Start with intent. Add autonomy only when it earns its place.">
      <BuildLoop compact />
    </SlideShell>
  )
}

export function AgentLabSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Interactive agent lab" title="Choose the smallest agent pattern that can do the job.">
      <AgentWorkbench compact />
    </SlideShell>
  )
}

export function ModelLabSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Interactive model lab" title="Model choice is a product trade-off, not a leaderboard.">
      <ModelWorkbench compact />
    </SlideShell>
  )
}

export function EvaluationSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Interactive evaluation lab" title="Quality is a system of signals.">
      <EvaluationConsole compact />
    </SlideShell>
  )
}

export function SessionsSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Six-session programme" title="Every session is reserved. Nothing is invented.">
      <div className="deck-session-grid">
        {SESSIONS.map((session) => (
          <article key={session.id}>
            <span>{session.number}</span>
            <div><strong>{session.topic}</strong><small>{session.date} · {session.speaker}</small></div>
          </article>
        ))}
      </div>
    </SlideShell>
  )
}

export function RegisterSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Registration" title="Register once. Update the same record later." className="register-slide">
      <RegistrationForm postLoginRedirect="/?register=1" />
    </SlideShell>
  )
}

export function ClosingSlide({ index }) {
  return (
    <SlideShell index={index} eyebrow="Agentic AI Apps Winter Bootcamp" className="closing-slide">
      <div className="closing-lockup">
        <span>Registration is open</span>
        <h2>Bring your stack.<br />Build agents with evidence.</h2>
        <p>Six sessions for the broader agent builder community.</p>
        <a href="#/">Return to the website →</a>
      </div>
    </SlideShell>
  )
}
