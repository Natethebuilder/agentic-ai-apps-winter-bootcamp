import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { BottomBar, Editable, Slide, useSlides } from '@deckio/deck-engine'
import RegistrationForm from '../registration/RegistrationForm.jsx'
import { Logos, Mascot } from '../winter/Decor.jsx'
import {
  BOOTCAMP, GITHUB_ACCESS, PERSONAS, PILLARS, PIPELINE, PREP, READINESS_PATHS, REGISTER_STEPS, SCHEDULE, SESSIONS, TEAM,
} from '../content.js'
import s from './Slides.module.css'

function SlideProgress({ index }) {
  const { visibleIndices = [], totalSlides } = useSlides()
  const order = visibleIndices.length ? visibleIndices : Array.from({ length: totalSlides }, (_, i) => i)
  const pos = Math.max(0, order.indexOf(index))
  const progress = ((pos + 1) / order.length) * 100
  return (
    <div className="slide-delivery-progress" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
      {Array.from({ length: 6 }, (_, node) => <i key={node} className={progress >= ((node + 1) / 6) * 100 ? 'is-complete' : ''} />)}
    </div>
  )
}

function Frame({ index, id, children, orbs = ['orbIce', 'orbPine'] }) {
  return (
    <Slide index={index} className={s.slide}>
      <SlideProgress index={index} />
      {orbs.map((o) => <div key={o} className={`orb ${s[o]}`} />)}
      <div className={`${s.body} content-frame content-gutter`}>{children}</div>
      <BottomBar text={<Editable as="span" id={`${id}.footer`}>{BOOTCAMP.footer}</Editable>} />
    </Slide>
  )
}

function Header({ id, eyebrow, title, subtitle }) {
  return (
    <div className={s.header}>
      <Editable as="p" id={`${id}.eyebrow`} className={s.eyebrow}>{eyebrow}</Editable>
      <Editable as="h1" id={`${id}.title`}>{title}</Editable>
      {subtitle && <Editable as="p" id={`${id}.subtitle`} multiline className={s.subtitle}>{subtitle}</Editable>}
    </div>
  )
}

export function WinterTitleSlide({ index }) {
  return (
    <Slide index={index} className={s.slide}>
      <SlideProgress index={index} />
      <div className={`orb ${s.orbIce}`} />
      <div className={`orb ${s.orbHolly}`} />
      <div className={`orb ${s.orbPine}`} />
      <div className={`${s.hero} content-frame content-gutter`}>
        <div>
          <span className={s.pill}><Editable as="span" id="title.pill">FOUNDRY · {BOOTCAMP.season} · Online</Editable></span>
          <h1>
            <Editable as="span" id="title.before">Foundry Agentic Development</Editable>{' '}
            <Editable as="span" id="title.highlight" className={s.highlight}>Winter Bootcamp</Editable>
          </h1>
          <Editable as="p" id="title.subtitle" multiline className={s.subtitle}>
            {`${BOOTCAMP.tagline} ${BOOTCAMP.subtitle}`}
          </Editable>
        </div>
        <Mascot className={s.heroMascot} />
      </div>
      <Logos className={s.heroLogos} size="md" />
      <BottomBar text={<Editable as="span" id="title.footer">{BOOTCAMP.footer}</Editable>} />
    </Slide>
  )
}

export function OfferingSlide({ index }) {
  return (
    <Frame index={index} id="offering" orbs={['orbIce', 'orbHolly']}>
      <div className={s.header}>
        <Editable as="p" id="offering.eyebrow" className={s.eyebrow}>Your invitation · Online event</Editable>
        <h1>
          <Editable as="span" id="offering.titleBefore">Build agents beyond the demo.</Editable>{' '}
          <Editable as="span" id="offering.titleHighlight" className={s.highlight}>Evaluate every run.</Editable>
        </h1>
        <Editable as="p" id="offering.subtitle" multiline className={s.subtitle}>
          A hands-on programme for AI application developers, solution and cloud architects, platform and AI/ML engineers, and technical product teams.
        </Editable>
      </div>
      <div className={`${s.grid} ${s.grid4}`}>
        {PILLARS.map((p) => (
          <div key={p.id} className={s.card}>
            <span className={s.icon}>{p.icon}</span>
            <Editable as="h3" id={`offering.${p.id}.title`}>{p.title}</Editable>
            <Editable as="p" id={`offering.${p.id}.desc`}>{p.desc}</Editable>
          </div>
        ))}
      </div>
      <div className={s.stats}>
        {[
          ['online', 'Online', 'Join live from anywhere'],
          ['weeks', 'Six sessions', 'Topics and dates TBC'],
          ['credits', '$100 AI credits', 'Included with event access'],
          ['cost', 'Free', 'Only your time'],
          ['team', 'Delivered by', 'Microsoft Solution Engineers & Architects'],
        ].map(([k, v, l]) => (
          <div key={k} className={s.stat}>
            <Editable as="span" id={`offering.stats.${k}.value`} className={s.statValue}>{v}</Editable>
            <Editable as="span" id={`offering.stats.${k}.label`} className={s.statLabel}>{l}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function AudienceSlide({ index }) {
  return (
    <Frame index={index} id="audience" orbs={['orbIce', 'orbPine']}>
      <Header
        id="audience"
        eyebrow="Who it's for"
        title="Made for the agent builder community"
        subtitle="Anyone who helps design, build, evaluate, deliver or operate AI applications."
      />
      <div className={`${s.grid} ${s.grid3}`}>
        {PERSONAS.map((p) => (
          <div key={p.id} className={s.card}>
            <span className={s.icon}>{p.icon}</span>
            <Editable as="h3" id={`audience.${p.id}.title`}>{p.label}</Editable>
            <Editable as="p" id={`audience.${p.id}.desc`}>{p.desc}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function FoundryLoopSlide({ index }) {
  return (
    <Frame index={index} id="foundry-loop" orbs={['orbIce', 'orbPine']}>
      <Header
        id="foundry-loop"
        eyebrow="Foundry development path"
        title="Five stages. No mystery."
        subtitle="Frame the job, choose the route, ground it, bound its actions and prove quality before release."
      />
      <div className={s.loopPath} aria-label="Foundry agent development path">
        {PIPELINE.map((stage, stageIndex) => (
          <div key={stage.id} className={s.loopStage} style={{ '--loop-accent': stage.color }}>
            <div className={s.loopStageHead}>
              <span>{String(stageIndex + 1).padStart(2, '0')}</span>
              <strong>{stage.label}</strong>
            </div>
            <p>{stage.what}</p>
            <small>Gate · {stage.gate}</small>
          </div>
        ))}
      </div>
      <p className={s.loopCaption}>GitHub Copilot supports the work at each stage; Microsoft Foundry provides the governed runtime and evaluation surface.</p>
    </Frame>
  )
}

export function TimetableSlide({ index }) {
  return (
    <Frame index={index} id="timetable" orbs={['orbIce', 'orbHolly']}>
      <Header
        id="timetable"
        eyebrow="Programme schedule"
        title="Six placeholder Fridays. Six sessions available each day."
        subtitle="These dates and times exist to test the complete registration flow. Every schedule detail remains TBC."
      />
      <div className={`${s.grid} ${s.grid6}`}>
        {SCHEDULE.map((date, i) => (
          <div key={date.id} className={s.door} style={{ '--door-accent': SESSIONS[i].accent }}>
            <span className={s.doorIcon} aria-hidden="true">FRI</span>
            <span className={s.doorNum}>{i + 1}</span>
            <Editable as="span" id={`timetable.${date.id}.week`} className={s.doorWeek}>{date.date}</Editable>
            <Editable as="span" id={`timetable.${date.id}.date`} className={s.doorDate}>09:30–15:00 · TBC</Editable>
          </div>
        ))}
      </div>
      <Editable as="p" id="timetable.caption" className={s.caption}>
        Placeholder dates and times · all six sessions available on every date · final schedule TBC
      </Editable>
    </Frame>
  )
}

export function SetupSlide({ index }) {
  return (
    <Frame index={index} id="setup" orbs={['orbIce', 'orbHolly']}>
      <Header
        id="setup"
        eyebrow="Foundations and readiness"
        title="Choose the right setup path"
        subtitle="Skip the foundations walkthrough only when every readiness check passes; otherwise use the guided setup before the hands-on programme."
      />
      <div className={s.readinessPaths}>
        {READINESS_PATHS.map((path) => (
          <div key={path.id}>
            <span>{path.number}</span>
            <strong>{path.title}</strong>
            <p>{path.desc}</p>
          </div>
        ))}
      </div>
      <div className={`${s.grid} ${s.grid4}`}>
        {PREP.slice(0, 4).map((p) => (
          <div key={p.id} className={s.card}>
            <span className={s.icon}>{p.icon}</span>
            <Editable as="h3" id={`setup.${p.id}.title`}>{p.title}</Editable>
            <Editable as="p" id={`setup.${p.id}.desc`}>{p.desc}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function SessionDetailsIntroSlide({ index }) {
  return (
    <Frame index={index} id="session-details-intro" orbs={['orbIce', 'orbHolly', 'orbPine']}>
      <div className={s.detailIntro}>
        <span className={s.pill}>PROGRAMME BRANCH</span>
        <Editable as="h1" id="sessionDetailsIntro.title">
          Six sessions. <span className={s.highlight}>Programme details TBC.</span>
        </Editable>
        <Editable as="p" id="sessionDetailsIntro.subtitle" multiline className={s.subtitle}>
          Each reserved session has space for its confirmed topic, speaker, outcomes, tools and hands-on activity.
        </Editable>
        <div className={s.detailIntroTracks}>
          {SESSIONS.map((session) => (
            <span key={session.id}><b>{session.number}</b>{session.track}</span>
          ))}
        </div>
      </div>
    </Frame>
  )
}

function SessionDetailSlide({ index, session }) {
  return (
    <Frame index={index} id={`detail-${session.id}`} orbs={['orbIce', 'orbPine']}>
      <div className={s.detailBody}>
        <div className={s.detailMeta}>
          <span className={s.detailNumber}>SESSION {session.number}</span>
          <span className={s.tag}>{session.audience}</span>
          <span className={`${s.tag} ${s.tagPine}`}>{session.format}</span>
        </div>
        <div className={s.detailHeader}>
          <div>
            <Editable as="h1" id={`detail.${session.id}.title`}>{session.title}</Editable>
            <Editable as="p" id={`detail.${session.id}.subtitle`} className={s.detailSubtitle}>{session.subtitle}</Editable>
          </div>
        </div>
        <Editable as="p" id={`detail.${session.id}.overview`} multiline className={s.detailOverview}>
          {session.overview}
        </Editable>
        <div className={s.detailGrid}>
          <div className={s.detailPanel}>
            <span className={s.detailLabel}>What you will explore</span>
            <ul>
              {session.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
            </ul>
          </div>
          <div className={s.detailStack}>
            <div className={`${s.detailPanel} ${s.detailChallenge}`}>
              <span className={s.detailLabel}>Session focus</span>
              <p>{session.spotlight}</p>
            </div>
            <div className={`${s.detailPanel} ${s.detailToolbox}`}>
              <div>
                <span className={s.detailLabel}>Session owner</span>
                <strong>{session.owner}</strong>
              </div>
              <div className={s.detailTools}>{session.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  )
}

export const sessionDetailSlides = SESSIONS.map((session) => {
  function SessionDetailComponent({ index }) {
    return <SessionDetailSlide index={index} session={session} />
  }
  SessionDetailComponent.displayName = `${session.id}SessionDetailSlide`
  return SessionDetailComponent
})

export function SurveySlide({ index }) {
  return (
    <Frame index={index} id="survey" orbs={['orbIce', 'orbPine']}>
      <Header
        id="survey"
        eyebrow="One request from us"
        title="Tell us how we did"
        subtitle="After each session, we will ask how we did so your feedback can improve the next session."
      />
      <div className={s.points}>
        {[
          ['TIME', 'short', 'Very short, about 2 minutes'],
          ['SAFE', 'pii', 'No PII captured. Feedback links to a company, not a person'],
          ['LOOP', 'improve', 'Used to improve the next session'],
        ].map(([icon, k, text]) => (
          <div key={k} className={s.point}>
            <span className={s.icon}>{icon}</span>
            <Editable as="span" id={`survey.${k}`}>{text}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function RegisterSlide({ index }) {
  const [registrationOpen, setRegistrationOpen] = useState(
    () => new URLSearchParams(window.location.search).get('deckRegister') === '1',
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get('deckRegister') !== '1') return
    url.searchParams.delete('deckRegister')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }, [])

  useEffect(() => {
    if (!registrationOpen) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setRegistrationOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape, true)
    return () => window.removeEventListener('keydown', closeOnEscape, true)
  }, [registrationOpen])

  return (
    <Frame index={index} id="register" orbs={['orbIce', 'orbHolly']}>
      <Header
        id="register"
        eyebrow="Ready to join?"
        title="How to register"
        subtitle="Registration is open. Confirm your company email; no GitHub sign-in is required."
      />
      <div className={s.registerSlideGrid}>
        <div className={s.points}>
          {REGISTER_STEPS.map((text, i) => (
            <div key={i} className={s.point}>
              <span className={s.stepNum}>{i + 1}</span>
              <Editable as="span" id={`register.step${i + 1}`}>{text}</Editable>
            </div>
          ))}
        </div>
        <div className={s.registerPrompt}>
          <span className={s.registerPromptMark}>GH</span>
          <div>
            <strong>{GITHUB_ACCESS.eyebrow}</strong>
            <p>The organization invitation and $100 of GitHub Copilot AI credits arrive a few days before the event.</p>
          </div>
          <button type="button" onClick={() => setRegistrationOpen(true)}>Open registration</button>
        </div>
      </div>
      {registrationOpen && createPortal(
        <div
          className={s.registrationOverlay}
          role="presentation"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setRegistrationOpen(false)}
        >
          <div
            className={s.registrationModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="deck-registration-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <div className={s.registrationModalHeader}>
              <div>
                <span>Foundry Agentic Development Winter Bootcamp</span>
                <h2 id="deck-registration-title">Bootcamp registration</h2>
              </div>
              <button type="button" aria-label="Close registration" onClick={() => setRegistrationOpen(false)}>×</button>
            </div>
            <RegistrationForm />
          </div>
        </div>,
        document.body,
      )}
    </Frame>
  )
}

export function TeamSlide({ index }) {
  return (
    <Frame index={index} id="team" orbs={['orbIce', 'orbPine']}>
      <Header
        id="team"
        eyebrow="Brought to you by"
        title="Your team"
        subtitle="Your host and session owners from the Microsoft AI application community."
      />
      <div className={`${s.grid} ${s.grid6}`}>
        {TEAM.map((person, index) => (
          <div key={person.id} className={`${s.card} ${s.helper}`}>
            <span className={s.helperInitials} style={{ '--avatar-accent': SESSIONS[index]?.accent }}>{person.initials}</span>
            <Editable as="h3" id={`team.${person.id}.name`}>{person.name}</Editable>
            <Editable as="p" id={`team.${person.id}.role`} className={s.helperRole}>{person.role}</Editable>
            <Editable as="p" id={`team.${person.id}.topic`} className={s.helperTopic}>{person.focus}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function DisclaimerSlide({ index }) {
  const items = [
    ['advisory', 'Educational, not consulting', "This is an educational, hands-on workshop series. Microsoft's role is advisory and facilitative on a best-effort basis. It is not a consulting engagement, managed service, implementation project, or delivery of a finished product. Exercises are for learning only and should not be used in production without your own review, testing, security, privacy and compliance approvals."],
    ['data', 'No sensitive data, code or credentials', 'Do not use confidential source code, production credentials, secrets, personal data, production systems or business-critical repositories during the workshops. Use sample or non-sensitive content only.'],
    ['outputs', 'Sample artifacts only', 'Any workshop outputs are sample and learning artifacts only. You are responsible for reviewing, adapting, testing, securing and approving any later use outside the workshop.'],
  ]
  return (
    <Frame index={index} id="disclaimer" orbs={['orbIce', 'orbHolly']}>
      <Header id="disclaimer" eyebrow="Please note" title="Workshop disclaimer" />
      <div className={`${s.grid} ${s.grid3} ${s.small}`}>
        {items.map(([k, title, desc]) => (
          <div key={k} className={s.card}>
            <Editable as="h3" id={`disclaimer.${k}.title`}>{title}</Editable>
            <Editable as="p" id={`disclaimer.${k}.desc`} multiline>{desc}</Editable>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function ThankYouSlide({ index }) {
  return (
    <Slide index={index} className={s.slide}>
      <SlideProgress index={index} />
      <div className={`orb ${s.orbIce}`} />
      <div className={`orb ${s.orbHolly}`} />
      <div className={`orb ${s.orbPine}`} />
      <div className={`${s.thanks} content-frame content-gutter`}>
        <span className={s.pill}>BUILD COMPLETE</span>
        <h1><Editable as="span" id="thankYou.title" className={s.highlight}>See you this winter</Editable></h1>
        <Editable as="p" id="thankYou.subtitle" multiline className={s.subtitle}>
          Questions? Reach out to your Microsoft contact.
        </Editable>
        <div className={s.thanksMascots}><Mascot className={s.thanksCopilot} /></div>
        <Logos size="sm" />
      </div>
      <BottomBar text={<Editable as="span" id="thankYou.footer">{BOOTCAMP.footer}</Editable>} />
    </Slide>
  )
}
