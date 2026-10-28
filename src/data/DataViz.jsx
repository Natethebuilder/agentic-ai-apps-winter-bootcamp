import { useEffect, useState } from 'react'
import { DATES_NOTE, SESSION_DATES, SESSIONS, TERMINAL_SCRIPTS } from '../content.js'
import { REGISTRATION_OPEN } from '../siteState.js'
import d from './Data.module.css'

/* ── Countdown to the first session, styled as the agent's next scheduled run ── */
export function Countdown({ target, date, dateLabel, preliminary = false, className = '' }) {
  const t = target ? new Date(target).getTime() : null
  const dateOnly = !t && date ? new Date(`${date}T12:00:00`) : null
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!t) return undefined
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [t])

  const diff = t == null ? null : Math.max(0, t - now)
  const parts = diff != null
    ? [
        Math.floor(diff / 86400000),
        Math.floor(diff / 3600000) % 24,
        Math.floor(diff / 60000) % 60,
        Math.floor(diff / 1000) % 60,
      ].map((n) => String(n).padStart(2, '0'))
    : dateOnly
      ? [
          String(dateOnly.getDate()).padStart(2, '0'),
          dateOnly.toLocaleString('en', { month: 'short' }).toUpperCase(),
          String(dateOnly.getFullYear()),
          dateOnly.toLocaleString('en', { weekday: 'short' }).toUpperCase(),
        ]
      : ['--', '--', '--', '--']
  const labels = dateOnly ? ['day', 'month', 'year', 'starts'] : ['days', 'hrs', 'min', 'sec']
  const dateStatus = preliminary ? 'preliminary dates' : 'dates confirmed'
  const status = t == null ? (dateOnly ? dateStatus : 'awaiting schedule') : diff > 0 ? 'scheduled' : 'live now'
  const statusClass = t == null
    ? (dateOnly && !preliminary ? d.statusOk : d.statusWait)
    : diff > 0 ? d.statusOk : d.statusLive

  return (
    <div className={`${d.countdown} ${className}`} role={t ? 'timer' : 'group'} aria-live="off">
      <div className={d.cdHead}>
        <span className={d.mono}>▸ next run · session_01</span>
        <span className={`${d.status} ${statusClass}`}><i />{status}</span>
      </div>
      <div className={d.cdDigits}>
        {labels.map((label, i) => (
          <div key={label} className={d.cdCell}>
            <span className={`${d.cdNum} ${t == null && !dateOnly ? d.cdPending : ''}`}>{parts[i]}</span>
            <span className={d.cdLabel}>{label}</span>
          </div>
        ))}
      </div>
      {(t != null || dateLabel) && (
        <p className={d.cdFoot}>
          First session: {t != null ? new Date(t).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' }) : dateLabel}
        </p>
      )}
    </div>
  )
}

/* ── Copilot CLI terminal that types an agent development request ── */
export function AgentTerminal({ className = '', children }) {
  const [scriptIndex, setScriptIndex] = useState(0)
  const { workspace, prompt, lines } = TERMINAL_SCRIPTS[scriptIndex]
  const [chars, setChars] = useState(0)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    let id
    if (chars < prompt.length) id = setTimeout(() => setChars((c) => c + 1), 24)
    else if (shown < lines.length) id = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 700 : 520)
    else {
      id = setTimeout(() => {
        setChars(0)
        setShown(0)
        setScriptIndex((current) => (current + 1) % TERMINAL_SCRIPTS.length)
      }, 4200)
    }
    return () => clearTimeout(id)
  }, [chars, shown, prompt.length, lines.length, scriptIndex])

  const typing = chars < prompt.length
  const working = !typing && shown < lines.length

  return (
    <div className={`${d.terminal} ${className}`}>
      {children}
      <div className={d.termBar}>
        <span className={d.dots}><i /><i /><i /></span>
        <span className={d.termTitle}>copilot · {workspace}</span>
      </div>
      <div className={d.termBody} aria-label={`Example: ${prompt}`}>
        <p className={d.termDim}>$ copilot</p>
        <p className={d.termPrompt}>
          <span className={d.termUser}>›</span> {prompt.slice(0, chars)}
          {typing && <span className={d.caret} />}
        </p>
        <ul className={d.termLines}>
          {lines.slice(0, shown).map((l) => (
            <li key={l.text} className={d[`line_${l.kind}`]}>
              <span className={d.lineIcon}>{l.kind === 'ok' ? '✓' : l.kind === 'done' ? '★' : '●'}</span>
              <span className={d.lineText}>{l.text}</span>
              {l.meta && <span className={d.lineMeta}>{l.meta}</span>}
            </li>
          ))}
          {working && (
            <li className={d.line_info}>
              <span className={d.spinner} />
              <span className={d.termDim}>working…</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

/* ── Six repeated event dates and the shared full-day agenda ── */
export function ScheduleBoard() {
  return (
    <div className={d.scheduleBoard}>
      <div className={d.dateRail} aria-label="Bootcamp dates">
        {SESSION_DATES.map((date) => (
          <article key={date.id} className={d.dateCard}>
            <span>{date.month}</span>
            <strong>{date.day}</strong>
            <small>Full programme</small>
          </article>
        ))}
      </div>
      <div className={d.agenda}>
        <div className={d.agendaHead}>
          <div>
            <span>Every event date</span>
            <strong>Six-session daily agenda</strong>
          </div>
          <p>
            {REGISTRATION_OPEN
              ? 'Select any combination of dates and session times during registration.'
              : 'Once registration opens, you can select any combination of dates and session times.'}
            {DATES_NOTE && <> {DATES_NOTE}</>}
          </p>
        </div>
        <div className={d.agendaGrid}>
          {SESSIONS.map((session) => (
            <article key={session.id} className={d.agendaSlot} style={{ '--slot-accent': session.accent }}>
              <time dateTime={session.time}>{session.time}</time>
              <div>
                <span>{session.number} · {session.track}</span>
                <strong>{session.shortTitle}</strong>
                <small>Owner · {session.owner}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
