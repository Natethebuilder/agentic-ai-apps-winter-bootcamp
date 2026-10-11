import { useState } from 'react'
import { SETUP_RESOURCES } from '../content.js'
import s from './SetupWizard.module.css'

const COPILOT_COMMANDS = [
  'gh auth status',
  'copilot',
  '/skills',
  '/mcp',
]

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return <button type="button" className={s.copy} onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
}

export default function SetupWizard() {
  const [tab, setTab] = useState('machine')

  return (
    <div className={s.wizard}>
      <div className={s.tabs} role="tablist" aria-label="AI application setup">
        <button type="button" role="tab" aria-selected={tab === 'machine'} onClick={() => setTab('machine')}>1 · Core tools</button>
        <button type="button" role="tab" aria-selected={tab === 'agent'} onClick={() => setTab('agent')}>2 · Agent tools</button>
        <button type="button" role="tab" aria-selected={tab === 'signin'} onClick={() => setTab('signin')}>3 · Sign in</button>
      </div>

      {tab === 'machine' && (
        <div className={s.panel} role="tabpanel">
          <div className={s.intro}>
            <div>
              <span className={s.kicker}>Foundry-ready prerequisites</span>
              <h3>Prepare the core AI application environment.</h3>
              <p>Install the tools needed for GitHub authentication, the sample application and any confirmed model or evaluation exercises.</p>
            </div>
          </div>
          <div className={s.resourceGrid}>
            {SETUP_RESOURCES.slice(0, 4).map((item) => (
              <a key={item.id} className={s.resource} href={item.href} target="_blank" rel="noreferrer">
                <strong>{item.label}</strong>
                <span>Check: {item.check}</span>
                <i>Official guidance ↗</i>
              </a>
            ))}
          </div>
        </div>
      )}

      {tab === 'agent' && (
        <div className={s.panel} role="tabpanel">
          <span className={s.kicker}>Inside GitHub Copilot CLI</span>
          <h3>Verify agent tools and connected services.</h3>
          <p className={s.panelLead}>Authenticate GitHub, start Copilot CLI, then inspect the skills and MCP tools available for the workshop.</p>
          <div className={s.commandBlock}>
            <pre><code>{COPILOT_COMMANDS.join('\n')}</code></pre>
            <CopyButton text={COPILOT_COMMANDS.join('\n')} />
          </div>
          <div className={s.resourceGrid}>
            {SETUP_RESOURCES.slice(4).map((item) => (
              <a key={item.id} className={s.resource} href={item.href} target="_blank" rel="noreferrer">
                <strong>{item.label}</strong>
                <span>{item.login}</span>
                <i>Official guidance ↗</i>
              </a>
            ))}
          </div>
        </div>
      )}

      {tab === 'signin' && (
        <div className={s.panel} role="tabpanel">
          <span className={s.kicker}>Use the workshop accounts</span>
          <h3>Authenticate GitHub and confirmed Foundry resources.</h3>
          <div className={s.signins}>
            {SETUP_RESOURCES.slice(0, 4).map((item) => (
              <article key={item.id}>
                <div><strong>{item.label}</strong><a href={item.href} target="_blank" rel="noreferrer">docs ↗</a></div>
                <code>{item.login}</code>
              </article>
            ))}
          </div>
          <div className={s.note}>Use a personal GitHub.com account for workshop access. Foundry project or model access will be supplied only if a confirmed session requires it.</div>
        </div>
      )}
    </div>
  )
}
