import { useEffect, useState } from 'react'
import { REGISTRATION, SESSIONS } from '../content.js'

async function loadPrincipal() {
  if (import.meta.env.DEV) {
    return { identityProvider: 'github', userDetails: 'preview-github-user', userId: 'local-preview' }
  }

  const response = await fetch('/.auth/me', { headers: { Accept: 'application/json' } })
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('GitHub authentication is unavailable')
  }
  const payload = await response.json()
  return payload.clientPrincipal
}

export default function RegistrationForm({ postLoginRedirect = '/?register=1' }) {
  const [principal, setPrincipal] = useState(undefined)
  const [authUnavailable, setAuthUnavailable] = useState(false)
  const [sessions, setSessions] = useState([])
  const [organisation, setOrganisation] = useState('')
  const [email, setEmail] = useState('')
  const [environment, setEnvironment] = useState('local')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadPrincipal()
      .then(setPrincipal)
      .catch(() => {
        setPrincipal(null)
        setAuthUnavailable(true)
      })
  }, [])

  const signedIn = principal?.identityProvider === 'github'
  const valid = signedIn && sessions.length > 0 && organisation.trim() && email.trim() && consent
  const loginUrl = `/.auth/login/github?post_login_redirect_uri=${encodeURIComponent(postLoginRedirect)}`

  const toggleSession = (id) => setSessions((current) => (
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  ))

  const submit = async (event) => {
    event.preventDefault()
    if (!valid || status === 'submitting') return

    setStatus('submitting')
    setMessage('')

    try {
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 450))
      } else {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organisation: organisation.trim(),
            email: email.trim(),
            sessions,
            environment,
            consent,
          }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Registration could not be saved')
      }

      setStatus('success')
      setMessage(`Thanks @${principal.userDetails}. Your AI Apps bootcamp registration is saved.`)
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  if (principal === undefined) {
    return <div className="auth-card"><span className="spinner" /> Checking GitHub sign-in…</div>
  }

  if (!signedIn) {
    return (
      <div className="auth-card">
        <span className="github-badge" aria-hidden="true">GH</span>
        <div>
          <h3>Sign in with GitHub to register</h3>
          <p>Your verified handle becomes the stable key for safe registration updates.</p>
          {authUnavailable && <small>GitHub sign-in is temporarily unavailable. Please try again shortly.</small>}
        </div>
        <a className="button button-primary" href={loginUrl}>Continue with GitHub</a>
      </div>
    )
  }

  return (
    <form className="registration-form" onSubmit={submit}>
      <div className="verified-identity">
        <span className="github-badge" aria-hidden="true">GH</span>
        <div><small>Verified GitHub account</small><strong>@{principal.userDetails}</strong></div>
        {!import.meta.env.DEV && <a href="/.auth/logout?post_logout_redirect_uri=/">Use another account</a>}
      </div>

      <div className="registration-fields">
        <label>
          <span>Company or organisation</span>
          <input required maxLength="160" autoComplete="organization" value={organisation} onChange={(event) => setOrganisation(event.target.value)} />
        </label>
        <label>
          <span>Company email address</span>
          <input required maxLength="254" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
      </div>

      <fieldset>
        <legend>Sessions of interest</legend>
        <div className="registration-session-grid">
          {SESSIONS.map((session) => (
            <label key={session.id} className={sessions.includes(session.id) ? 'is-selected' : ''}>
              <input type="checkbox" checked={sessions.includes(session.id)} onChange={() => toggleSession(session.id)} />
              <span><strong>Session {session.number}</strong><small>{session.topic}</small></span>
              <i>{sessions.includes(session.id) ? '✓' : '+'}</i>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Preferred development environment</legend>
        <div className="environment-options">
          {REGISTRATION.choices.map((choice) => (
            <label key={choice.id}>
              <input type="radio" name="environment" value={choice.id} checked={environment === choice.id} onChange={(event) => setEnvironment(event.target.value)} />
              <span>{choice.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="consent-field">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        <span>{REGISTRATION.consent}</span>
      </label>

      <div className="submit-row">
        <button className="button button-primary" type="submit" disabled={!valid || status === 'submitting' || status === 'success'}>
          {status === 'submitting' ? 'Saving…' : status === 'success' ? 'Registered ✓' : 'Submit registration'}
        </button>
        <small>We never ask for or store your GitHub password.</small>
      </div>
      {message && <p className={`form-message ${status === 'error' ? 'is-error' : ''}`} role="status">{message}</p>}
    </form>
  )
}
