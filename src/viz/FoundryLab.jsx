import { useMemo, useState } from 'react'
import { AGENT_PATTERNS, BUILD_LOOP, EVALUATORS, MODEL_PROFILES } from '../content.js'

export function BuildLoop({ compact = false }) {
  const [active, setActive] = useState('intent')
  const selected = BUILD_LOOP.find((item) => item.id === active)

  return (
    <div className={`build-loop ${compact ? 'is-compact' : ''}`}>
      <div className="loop-track" role="tablist" aria-label="AI application build loop">
        {BUILD_LOOP.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active === item.id}
            className={active === item.id ? 'is-active' : ''}
            onClick={() => setActive(item.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.label}
          </button>
        ))}
      </div>
      <div className="loop-readout" aria-live="polite">
        <span>Current layer</span>
        <strong>{selected.label}</strong>
        <p>{selected.detail}</p>
      </div>
    </div>
  )
}

export function ModelWorkbench({ compact = false }) {
  const [profileId, setProfileId] = useState('balanced')
  const [grounding, setGrounding] = useState(true)
  const profile = MODEL_PROFILES.find((item) => item.id === profileId)
  const scores = useMemo(() => ({
    ...profile.scores,
    quality: Math.min(99, profile.scores.quality + (grounding ? 4 : 0)),
  }), [grounding, profile])

  return (
    <div className={`model-workbench ${compact ? 'is-compact' : ''}`}>
      <div className="workbench-controls">
        <span className="viz-label">Model profile</span>
        <div className="segmented">
          {MODEL_PROFILES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={profileId === item.id ? 'is-active' : ''}
              onClick={() => setProfileId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="grounding-toggle">
          <input type="checkbox" checked={grounding} onChange={(event) => setGrounding(event.target.checked)} />
          <span>Ground with trusted context</span>
        </label>
      </div>
      <div className="model-output">
        <div className="model-chip"><i /> {profile.model}</div>
        <p>{profile.signal}</p>
        <div className="score-grid">
          {Object.entries(scores).map(([key, value]) => (
            <div key={key}>
              <span>{key}</span>
              <div className="score-track"><i style={{ width: `${value}%` }} /></div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AgentWorkbench({ compact = false }) {
  const [patternId, setPatternId] = useState('tool-agent')
  const [approval, setApproval] = useState(true)
  const pattern = AGENT_PATTERNS.find((item) => item.id === patternId)
  const autonomy = Math.max(15, pattern.scores.autonomy - (approval ? 12 : 0))
  const traceability = Math.min(99, pattern.scores.traceability + (approval ? 4 : 0))

  return (
    <div className={`agent-workbench ${compact ? 'is-compact' : ''}`}>
      <div className="agent-patterns" role="tablist" aria-label="Agent orchestration pattern">
        {AGENT_PATTERNS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={patternId === item.id}
            className={patternId === item.id ? 'is-active' : ''}
            onClick={() => setPatternId(item.id)}
          >
            <span>{item.label}</span>
            <small>{item.description}</small>
          </button>
        ))}
      </div>
      <div className="agent-runtime">
        <header><span>Agent run</span><strong>{pattern.label}</strong></header>
        <div className="agent-route">
          {pattern.route.map((step, index) => (
            <div key={step}>
              <i>{String(index + 1).padStart(2, '0')}</i>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <label className="approval-toggle">
          <input type="checkbox" checked={approval} onChange={(event) => setApproval(event.target.checked)} />
          <span>Require human approval before actions</span>
        </label>
        <div className="agent-scores">
          {[
            ['autonomy', autonomy],
            ['traceability', traceability],
            ['coordination', pattern.scores.coordination],
          ].map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <div><i style={{ width: `${value}%` }} /></div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function EvaluationConsole({ compact = false }) {
  const [selected, setSelected] = useState(['groundedness', 'task', 'safety'])
  const toggle = (id) => setSelected((current) => (
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  ))
  const readiness = 42 + selected.length * 13

  return (
    <div className={`evaluation-console ${compact ? 'is-compact' : ''}`}>
      <div className="evaluation-list">
        {EVALUATORS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={selected.includes(item.id) ? 'is-selected' : ''}
            onClick={() => toggle(item.id)}
            aria-pressed={selected.includes(item.id)}
          >
            <i>{selected.includes(item.id) ? '✓' : '+'}</i>
            <span><strong>{item.label}</strong><small>{item.description}</small></span>
          </button>
        ))}
      </div>
      <div className="readiness-gauge">
        <span>Evaluation coverage</span>
        <strong>{readiness}%</strong>
        <div><i style={{ width: `${readiness}%` }} /></div>
        <small>{selected.length ? `${selected.length} signals selected` : 'Select signals to build an evaluation plan'}</small>
      </div>
    </div>
  )
}
