import { useState } from 'react'
import { MICROHACK_RESOURCES } from '../content.js'
import s from './SetupWizard.module.css'

const ACCESS = [
  ['Azure', 'Temporary Azure credentials for your session’s lab arrive by email before the session.'],
  ['GitHub', 'Only needed if your session uses it. Your invitation will tell you.'],
  ['Data', 'Labs use sample or non-sensitive data. Never bring production credentials or customer data.'],
]

const RHYTHM = [
  ['10 min', 'Introduction: what you will build and why'],
  ['40 min', 'Follow along in your lab with prepared copy/paste steps'],
  ['10 min', 'Recap, questions and what to try next'],
]

export default function SetupWizard() {
  const [tab, setTab] = useState('before')

  return (
    <div className={s.wizard}>
      <div className={s.tabs} role="tablist" aria-label="MicroHack lab preparation">
        <button type="button" role="tab" aria-selected={tab === 'before'} onClick={() => setTab('before')}>1 · Before</button>
        <button type="button" role="tab" aria-selected={tab === 'access'} onClick={() => setTab('access')}>2 · Access</button>
        <button type="button" role="tab" aria-selected={tab === 'session'} onClick={() => setTab('session')}>3 · Session</button>
      </div>

      {tab === 'before' && (
        <div className={s.panel} role="tabpanel">
          <span className={s.kicker}>Prerequisites</span>
          <h3>Bring Azure and Git basics.</h3>
          <p className={s.panelLead}>The labs assume you know your way around Azure and can work with a Git repository. Brush up with these if you need to.</p>
          <div className={s.resourceGrid}>
            {MICROHACK_RESOURCES.map((item) => (
              <a key={item.id} className={s.resource} href={item.href} target="_blank" rel="noreferrer">
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
                <i>Open ↗</i>
              </a>
            ))}
          </div>
        </div>
      )}

      {tab === 'access' && (
        <div className={s.panel} role="tabpanel">
          <span className={s.kicker}>Before your session</span>
          <h3>Watch your inbox for your Azure login.</h3>
          <p className={s.panelLead}>Every session has its own MicroHack lab, so keep the email for the session you are joining at hand.</p>
          <div className={s.rhythm}>
            {ACCESS.map(([label, text]) => (
              <article key={label}><strong>{label}</strong><span>{text}</span></article>
            ))}
          </div>
        </div>
      )}

      {tab === 'session' && (
        <div className={s.panel} role="tabpanel">
          <span className={s.kicker}>10 · 40 · 10</span>
          <h3>Follow along in your lab.</h3>
          <p className={s.panelLead}>Every one-hour session follows the same rhythm.</p>
          <div className={s.rhythm}>
            {RHYTHM.map(([label, text]) => (
              <article key={label + text}><strong>{label}</strong><span>{text}</span></article>
            ))}
          </div>
          <div className={s.note}>
            Each session stands on its own: open that session’s lab repository and start from its entry point.
          </div>
        </div>
      )}
    </div>
  )
}
