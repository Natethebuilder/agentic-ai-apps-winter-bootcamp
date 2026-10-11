import { useEffect, useState } from 'react'
import { EVENT, FAQ, SESSIONS, VALUE } from '../content.js'
import RegistrationForm from '../registration/RegistrationForm.jsx'
import { MotionToggle } from '../theme/AuroraField.jsx'
import { AgentWorkbench, BuildLoop, EvaluationConsole, ModelWorkbench } from '../viz/FoundryLab.jsx'

function Mark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i /><i /><i />
    </span>
  )
}

function SessionCard({ session }) {
  return (
    <article className="session-card">
      <div className="session-card-top">
        <span>Session {session.number}</span>
        <time>{session.date}</time>
      </div>
      <div className="headshot-placeholder" aria-label={session.headshot}>
        <span className="silhouette-face" />
        <span className="silhouette-shoulders" />
        <small>{session.headshot}</small>
      </div>
      <h3>{session.topic}</h3>
      <p>{session.description}</p>
      <div className="speaker-placeholder">
        <strong>{session.speaker}</strong>
      </div>
      <footer><span>{session.time}</span><span>Details TBC</span></footer>
    </article>
  )
}

export default function Site({ motion, onToggleMotion }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('register') === '1') {
      window.setTimeout(() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="site-nav">
        <a className="brand" href="#top" onClick={closeMenu}>
          <Mark />
          <span><strong>AI Apps</strong><small>Winter Bootcamp</small></span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          <a href="#programme" onClick={closeMenu}>Programme</a>
          <a href="#labs" onClick={closeMenu}>Interactive labs</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <a className="nav-register" href="#register" onClick={closeMenu}>Register</a>
          <a href="#/deck" onClick={closeMenu}>Present the deck</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section" id="hero" data-panel>
          <div className="hero-copy">
            <div className="eyebrow"><span /> {EVENT.eyebrow}</div>
            <h1>Build agents that work beyond the <em>demo.</em></h1>
            <p>{EVENT.summary}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#register">Register your interest</a>
              <a className="button button-quiet" href="#programme">Explore the six sessions</a>
            </div>
            <div className="hero-meta">
              <span><small>When</small>{EVENT.date}</span>
              <span><small>Format</small>{EVENT.format}</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="foundry-orbit">
              <div className="orbit orbit-one"><i /><i /><i /></div>
              <div className="orbit orbit-two"><i /><i /></div>
              <div className="core">
                <Mark />
                <strong>Agent</strong>
                <small>intent → action</small>
              </div>
              <span className="orbit-label label-model">Model</span>
              <span className="orbit-label label-tools">Tools</span>
              <span className="orbit-label label-agent">Agent</span>
              <span className="orbit-label label-eval">Evaluate</span>
            </div>
            <div className="hero-status"><i /> Programme skeleton ready · details TBC</div>
          </div>
        </section>

        <section className="community-strip" aria-label="Community framing">
          <span>Application-first</span><i />
          <span>Framework-aware</span><i />
          <span>Foundry-inspired</span><i />
          <span>Community-built</span>
        </section>

        <section className="section intro-section" id="why" data-panel>
          <div className="section-heading">
            <span className="kicker">Why this bootcamp</span>
            <h2>From model access to a dependable agent.</h2>
            <p>Agent builders need more than prompt tips. This series follows the decisions that turn capability into a useful, observable and responsible control loop.</p>
          </div>
          <div className="value-grid">
            {VALUE.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section lab-section" id="labs" data-panel>
          <div className="section-heading split-heading">
            <div>
              <span className="kicker">Interactive build loop</span>
              <h2>Explore the decisions inside an agent.</h2>
            </div>
            <p>Use these lightweight Foundry-inspired tools to shape an agent runtime, compare model trade-offs and choose evaluation signals.</p>
          </div>
          <BuildLoop />
          <div className="lab-grid">
            <article className="lab-panel lab-panel-wide">
              <header><span>01 / Agent orchestration</span><strong>Agent runtime</strong></header>
              <AgentWorkbench />
            </article>
            <article className="lab-panel">
              <header><span>02 / Model routing</span><strong>Model workbench</strong></header>
              <ModelWorkbench />
            </article>
            <article className="lab-panel">
              <header><span>03 / Quality system</span><strong>Evaluation console</strong></header>
              <EvaluationConsole />
            </article>
          </div>
        </section>

        <section className="section programme-section" id="programme" data-panel>
          <div className="section-heading split-heading">
            <div>
              <span className="kicker">Six-session programme</span>
              <h2>The shape is set. The programme is next.</h2>
            </div>
            <p>Every card is intentionally labelled as a placeholder. Topic, date, speaker and headshot details will be added only when confirmed.</p>
          </div>
          <div className="session-grid">
            {SESSIONS.map((session) => <SessionCard key={session.id} session={session} />)}
          </div>
        </section>

        <section className="section audience-section" id="community" data-panel>
          <div className="audience-copy">
            <span className="kicker">Built for the broader community</span>
            <h2>Bring your stack. Bring your questions.</h2>
            <p>{EVENT.audience}. The programme will connect Microsoft Foundry agent concepts to transferable orchestration, tool-use and delivery practices.</p>
          </div>
          <div className="community-map">
            <header><span>Community profile</span><strong>Open by design</strong></header>
            <div>
              <article><small>Platform</small><strong>Your choice</strong></article>
              <article><small>Framework</small><strong>Open</strong></article>
              <article><small>Experience</small><strong>All levels</strong></article>
              <article><small>Goal</small><strong>Dependable agents</strong></article>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq" data-panel>
          <div className="section-heading">
            <span className="kicker">Questions, answered</span>
            <h2>What we know now.</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item, index) => (
              <article key={item.question} className={openFaq === index ? 'is-open' : ''}>
                <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.question}</strong>
                  <i>{openFaq === index ? '−' : '+'}</i>
                </button>
                <div><p>{item.answer}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section registration-section" id="register" data-panel>
          <div className="registration-heading">
            <span className="kicker">Registration is open</span>
            <h2>Reserve your place across the six-session series.</h2>
            <p>Choose any sessions that interest you now. Your verified GitHub identity lets you return and update the same registration later.</p>
          </div>
          <RegistrationForm />
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="#top"><Mark /><span><strong>AI Apps</strong><small>Winter Bootcamp</small></span></a>
        <p>Programme details remain subject to confirmation.</p>
        <div><MotionToggle enabled={motion} onToggle={onToggleMotion} /><a href="#/deck">Present the deck →</a></div>
      </footer>
    </div>
  )
}
