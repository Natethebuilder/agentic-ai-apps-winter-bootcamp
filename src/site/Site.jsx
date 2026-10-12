import { useEffect, useRef, useState } from 'react'
import { FoundryMark, Logos, Mascot } from '../winter/Decor.jsx'
import { SnowToggle } from '../winter/Snowfall.jsx'
import { AgentTerminal, Countdown, ScheduleQuery } from '../data/DataViz.jsx'
import SetupWizard from '../setup/SetupWizard.jsx'
import RegistrationForm from '../registration/RegistrationForm.jsx'
import {
  BOOTCAMP, FAQ, GITHUB_ACCESS, PERSONAS, PILLARS, PREP, REGISTRATION, SESSIONS,
} from '../content.js'
import s from './Site.module.css'

const NAV = [
  ['why', 'Why join'],
  ['lineup', 'Lineup'],
  ['schedule', 'Schedule'],
  ['prepare', 'Get ready'],
  ['faq', 'FAQ'],
  ['join', 'Register'],
]

const PREP_KEY = 'foundry-agentic-development-winter-bootcamp:prep'
const DECK_URL = `${import.meta.env.BASE_URL}#/deck`

function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const els = root.querySelectorAll(`.${s.reveal}`)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add(s.in)),
      { root, threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))

    // Items pop in as they scroll into view; long single-column phone sections otherwise feel static
    const items = root.querySelectorAll(`.${s.grid} > *, .${s.checkItem}, .${s.faqItem}, .${s.personaBox}`)
    const itemIo = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, k) => {
        e.target.style.setProperty('--i', k)
        e.target.classList.add(s.popIn)
        itemIo.unobserve(e.target)
      })
    }, { root, threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
    items.forEach((el) => { el.classList.add(s.pop); itemIo.observe(el) })

    return () => { io.disconnect(); itemIo.disconnect() }
  }, [rootRef])
}

// Each section is a self-contained, full-height panel so it reads on its own.
function Section({ id, idx, eyebrow, title, subtitle, className = '', children }) {
  return (
    <section id={id} className={`${s.panel} ${className}`} data-panel>
      <div className={`${s.section} ${s.reveal}`}>
        <div className={s.sectionHead}>
          <p className={s.eyebrow}><span className={s.eyebrowIdx}>{idx}</span>{eyebrow}</p>
          <h2>{title}</h2>
          {subtitle && <p className={s.lead}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}

function useActiveSection(rootRef) {
  const [active, setActive] = useState('top')
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { root, rootMargin: '-45% 0px -50% 0px' },
    )
    root.querySelectorAll('[data-panel]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rootRef])
  return active
}

function PersonaPicker() {
  const [sel, setSel] = useState(PERSONAS[0].id)
  const p = PERSONAS.find((x) => x.id === sel)
  return (
    <div className={s.personaBox}>
      <div className={s.personaTabs} role="tablist" aria-label="Pick your role">
        <span className={s.personasLabel}>Made for</span>
        {PERSONAS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={x.id === sel}
            className={`${s.persona} ${x.id === sel ? s.personaOn : ''}`}
            onClick={() => setSel(x.id)}
          >
            {x.icon} {x.label}
          </button>
        ))}
      </div>
      <div className={s.personaPanel} role="tabpanel" key={sel}>
        <p>{p.does}</p>
        <div className={s.stack}>
          <span className={s.stackLabel}>your stack</span>
          {p.stack.map((t) => <span key={t} className={s.stackChip}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

function ProgrammeReveal() {
  const [open, setOpen] = useState(false)

  return (
    <div className={s.programmeReveal}>
      <button
        type="button"
        className={`${s.programmeMerge} ${open ? s.programmeMergeOpen : ''}`}
        aria-expanded={open}
        aria-controls="programme-sessions"
        aria-label="Merge the programme"
        disabled={open}
        onClick={() => setOpen(true)}
      >
        <span className={s.mergeTop}><i />foundry project · agentic development</span>
        <span className={s.mergeBranches}><strong>foundry/programme-tbc</strong><i>→</i><strong>bootcamp</strong></span>
        <span className={s.mergeSummary}>6 session placeholders · ready for review</span>
        <span className={s.mergeAction}>{open ? 'Deployed' : 'Deploy programme'}</span>
        <span className={s.mergePackets} aria-hidden="true"><i /><i /><i /><i /></span>
      </button>

      {open && (
        <div id="programme-sessions" className={s.sessionList}>
          {SESSIONS.map((session, index) => (
            <article
              key={session.id}
              className={`${s.sessionRow} ${s.sessionRowOpen}`}
              style={{ '--i': index, '--session-accent': session.accent }}
            >
              <div className={s.sessionSummary}>
                <span className={s.sessionNumber}>{session.number}</span>
                <span className={s.sessionHeading}>
                  <span className={s.sessionAudience}>{session.audience}</span>
                  <strong>{session.title}</strong>
                  <small>{session.subtitle}</small>
                </span>
                <span className={s.sessionLead}>
                  <span className={s.sessionHeadshot} aria-hidden="true"><i /><b /></span>
                  <span className={s.sessionLeadCopy}>
                    <small>Session lead</small>
                    <strong>{session.lead}</strong>
                  </span>
                </span>
              </div>

              <div className={s.sessionDetails}>
                <p className={s.sessionSpotlight}>{session.spotlight}</p>
                <p className={s.sessionOverview}>{session.overview}</p>

                <div className={s.sessionDepth}>
                  <div>
                    <h4>You will</h4>
                    <ul>
                      {session.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                    </ul>
                  </div>
                  <div className={s.sessionToolkit}>
                    <span>Tools and concepts</span>
                    <div className={s.sessionTools}>
                      {session.tools.map((tool) => <span key={tool}>{tool}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function PrepChecklist() {
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PREP_KEY)) || {} } catch { return {} }
  })
  useEffect(() => {
    try { localStorage.setItem(PREP_KEY, JSON.stringify(done)) } catch { /* ignore */ }
  }, [done])

  const count = PREP.filter((p) => done[p.id]).length
  const pct = Math.round((count / PREP.length) * 100)
  const all = count === PREP.length

  return (
    <div className={s.checklist}>
      <div className={s.checkHead}>
        <div>
          <span className={s.checkScore}>{count}/{PREP.length}</span>
          <span className={s.checkLabel}>{all ? 'All checks passed. You are ready.' : 'checks passed'}</span>
        </div>
        <div className={s.progress} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
      <ul>
        {PREP.map((p) => (
          <li key={p.id}>
            <label className={`${s.checkItem} ${done[p.id] ? s.checked : ''}`}>
              <input
                type="checkbox"
                checked={Boolean(done[p.id])}
                onChange={(e) => setDone((d) => ({ ...d, [p.id]: e.target.checked }))}
              />
              <span className={s.checkBox} aria-hidden="true">{done[p.id] ? '✓' : ''}</span>
              <span className={s.checkIcon} aria-hidden="true">{p.icon}</span>
              <span className={s.checkText}>
                <strong>{p.title}</strong>
                <small>{p.desc}</small>
              </span>
              <span className={`${s.badge} ${done[p.id] ? s.badgePass : ''}`}>{done[p.id] ? 'PASS' : 'PENDING'}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Site({ snow, onToggleSnow }) {
  const rootRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  useReveal(rootRef)
  const active = useActiveSection(rootRef)

  const go = (id) => rootRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('register') === '1') {
      const id = setTimeout(() => go('join'), 100)
      return () => clearTimeout(id)
    }
    return undefined
  }, [])

  return (
    <div className={s.site} ref={rootRef} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 40)}>

      <header className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
        <button type="button" className={s.brand} onClick={() => go('top')}>
          <span className={s.brandMark}>
            <FoundryMark className={s.brandLogo} />
          </span>
          <span className={s.brandText}><small>Foundry Agentic Development</small><strong>Winter Bootcamp</strong></span>
        </button>
        <nav className={s.navLinks} aria-label="Sections">
          {NAV.map(([id, label]) => (
            <button key={id} type="button" className={active === id ? s.navActive : ''} aria-current={active === id ? 'true' : undefined} onClick={() => go(id)}>{label}</button>
          ))}
        </nav>
        <div className={s.navActions}>
          <SnowToggle enabled={snow} onToggle={onToggleSnow} />
          <a className={`${s.btnGhost} ${s.navDeck}`} href={DECK_URL}>▶ Deck</a>
        </div>
      </header>

      <main>
        <section id="top" className={`${s.panel} ${s.heroPanel}`} data-panel>
          <div className={s.hero}>
          <div className={s.heroText}>
            <span className={s.pill}>MICROSOFT FOUNDRY · {BOOTCAMP.season} · Online · Free · $100 AI credits included</span>
            <h1>
              Foundry Agentic Development <span className={s.highlight}>Winter Bootcamp</span>
            </h1>
            <p className={s.heroLead}>
              <strong>{BOOTCAMP.tagline}</strong> {BOOTCAMP.subtitle}
            </p>
            <div className={s.ctaRow}>
              <a className={s.btnGhost} href={DECK_URL}>▶ Present the deck</a>
              <button type="button" className={s.btnGhost} onClick={() => go('lineup')}>See the lineup</button>
              <button type="button" className={s.btnPrimary} onClick={() => go('join')}>Register now</button>
            </div>
            <Countdown
              target={BOOTCAMP.kickoff}
              date={BOOTCAMP.kickoffDate}
              dateLabel={BOOTCAMP.kickoffLabel}
              className={s.countdown}
            />
          </div>
          <div className={s.heroArt}>
            <AgentTerminal className={s.terminal}>
              <Mascot className={s.perched} />
            </AgentTerminal>
            <Logos size="md" className={s.heroLogos} />
          </div>
          </div>
          <button type="button" className={s.scrollCue} onClick={() => go('why')} aria-label="Next section">
            <span>scroll</span><i aria-hidden="true">↓</i>
          </button>
        </section>

        <Section
          id="why"
          idx="01"
          eyebrow="Why join"
          title="From Foundry project to dependable agent application."
          subtitle="A hands-on programme for developers, architects, product builders, platform teams and technical leaders."
        >
          <div className={`${s.grid} ${s.g3}`}>
            {PILLARS.map((p) => (
              <article key={p.id} className={s.card}>
                <span className={s.icon}>{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </article>
            ))}
          </div>
          <div className={s.ticketCallout}>
            <span aria-hidden="true">GH</span>
            <div>
              <small>{GITHUB_ACCESS.eyebrow}</small>
              <h3>{GITHUB_ACCESS.title}</h3>
              <p>{GITHUB_ACCESS.description}</p>
            </div>
          </div>
          <PersonaPicker />
        </Section>


        <Section
          id="lineup"
          idx="02"
          eyebrow="The lineup"
          title="Assemble the programme."
          subtitle="Deploy the placeholder programme to inspect all six reserved sessions."
          className={s.lineupPanel}
        >
          <ProgrammeReveal />
        </Section>

        <Section
          id="schedule"
          idx="03"
          eyebrow="Schedule"
          title="Six sessions. One connected Foundry programme."
          subtitle="Topics and dates are still being confirmed. The programme will connect intent, models, knowledge, tools, orchestration and evaluation."
        >
          <ScheduleQuery />
        </Section>

        <Section
          id="prepare"
          idx="04"
          eyebrow="Get ready"
          title="Pre-flight checks"
          subtitle="Prepare the core AI application tools, connect the required accounts, then tick off the checks. Progress stays in this browser only."
          className={s.preflightPanel}
        >
          <div className={s.setupStack}>
            <div className={s.preflightBlock}>
              <div className={s.preflightLabel}><span>01</span><strong>Readiness checklist</strong></div>
              <PrepChecklist />
            </div>
            <div className={s.preflightBlock}>
              <div className={s.preflightLabel}><span>02</span><strong>Guided setup</strong></div>
              <SetupWizard />
            </div>
          </div>
        </Section>

        <Section id="faq" idx="05" eyebrow="FAQ" title="Frequently asked questions">
          <div className={s.faq}>
            {FAQ.map((f) => (
              <details key={f.q} className={s.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section
          id="join"
          idx="06"
          eyebrow={REGISTRATION.eyebrow}
          title={REGISTRATION.title}
          subtitle={REGISTRATION.subtitle}
        >
          <RegistrationForm />
        </Section>

        <footer className={s.footer}>
          <Logos size="sm" />
          <p>
            Educational workshop series delivered by Microsoft. Not a consulting engagement. Use sample or
            sample or non-sensitive data and repositories only. Workshop outputs are learning artifacts.
          </p>
          <p className={s.footerSmall}>Built with DECKIO</p>
        </footer>
      </main>
    </div>
  )
}
