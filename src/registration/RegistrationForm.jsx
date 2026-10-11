import { useEffect, useState } from 'react'
import { REGISTRATION, SESSIONS } from '../content.js'
import s from './RegistrationForm.module.css'

async function loadPrincipal() {
  if (import.meta.env.DEV) {
    return { identityProvider: 'github', userDetails: 'preview-github-user', userId: 'local-preview' }
  }
  const response = await fetch('/.auth/me', { headers: { Accept: 'application/json' } })
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Auth host unavailable')
  const payload = await response.json()
  return payload.clientPrincipal
}

export default function RegistrationForm({ postLoginRedirect = '/?register=1' }) {
  const [principal, setPrincipal] = useState(undefined)
  const [authUnavailable, setAuthUnavailable] = useState(false)
  const [sessions, setSessions] = useState([])
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [environment, setEnvironment] = useState('local')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadPrincipal().then(setPrincipal).catch(() => { setPrincipal(null); setAuthUnavailable(true) })
  }, [])

  const signedIn = principal?.identityProvider === 'github'
  const valid = signedIn && sessions.length > 0 && company.trim() && email.trim() && consent
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
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company: company.trim(), email: email.trim(), sessions, environment, consent }),
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Registration could not be saved')
      }
      setStatus('success')
      setMessage(`Thanks @${principal.userDetails}. Your registration is saved.`)
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  if (principal === undefined) {
    return <div className={s.authCard}><span className={s.spinner} /> Checking GitHub sign-in…</div>
  }

  if (!signedIn) {
    return (
      <div className={s.authCard}>
        <span className={s.githubMark}>GH</span>
        <div>
          <h3>Sign in with GitHub to register</h3>
          <p>Connect the GitHub account you want to use for the bootcamp.</p>
          {authUnavailable && <small>GitHub sign-in is temporarily unavailable. Please try again shortly.</small>}
        </div>
        <a className={s.signIn} href={loginUrl}>Continue with GitHub</a>
      </div>
    )
  }

  return (
    <form className={s.form} onSubmit={submit}>
      <div className={s.identity}>
        <span className={s.avatar} aria-hidden="true">GH</span>
        <div><span>Verified GitHub account</span><strong>@{principal.userDetails}</strong></div>
        {!import.meta.env.DEV && <a href="/.auth/logout?post_logout_redirect_uri=/">Use another account</a>}
      </div>

      <div className={s.fields}>
        <label>
          <span>Company or organisation</span>
          <input required autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label>
          <span>Company email address</span>
          <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <fieldset className={s.sessionField}>
        <legend>Which sessions are you interested in?</legend>
        <div className={s.sessionGrid}>
          {SESSIONS.map((session) => (
            <label key={session.id} className={sessions.includes(session.id) ? s.sessionOn : ''}>
              <input type="checkbox" checked={sessions.includes(session.id)} onChange={() => toggleSession(session.id)} />
              <span><strong>{session.number} · {session.title}</strong><small>{session.subtitle}</small></span>
              <i>{sessions.includes(session.id) ? '✓' : '+'}</i>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={s.environment}>
        <legend>Development environment</legend>
        {REGISTRATION.environments.map((option) => (
          <label key={option.id}>
            <input type="radio" name="environment" value={option.id} checked={environment === option.id} onChange={(e) => setEnvironment(e.target.value)} />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <label className={s.consent}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{REGISTRATION.consent}</span>
      </label>

      <div className={s.submitRow}>
        <button type="submit" disabled={!valid || status === 'submitting' || status === 'success'}>
          {status === 'submitting' ? 'Saving…' : status === 'success' ? 'Registered ✓' : 'Submit registration'}
        </button>
        <small>We never ask for or store your GitHub password.</small>
      </div>
      {message && <p className={`${s.message} ${status === 'error' ? s.error : ''}`} role="status">{message}</p>}
    </form>
  )
}
