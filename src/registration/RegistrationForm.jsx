import { useState } from 'react'
import { REGISTRATION, SESSIONS } from '../content.js'
import s from './RegistrationForm.module.css'

const TOKEN_KEY = 'foundry-agentic-development-winter-bootcamp:registration-token'

function readRegistrationToken() {
  try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
}

function saveRegistrationToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch { /* ignore */ }
}

export default function RegistrationForm() {
  const [sessions, setSessions] = useState([])
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [emailConfirmation, setEmailConfirmation] = useState('')
  const [registrationToken, setRegistrationToken] = useState(readRegistrationToken)
  const [environment, setEnvironment] = useState('local')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const normalizedEmail = email.trim().toLowerCase()
  const normalizedConfirmation = emailConfirmation.trim().toLowerCase()
  const emailsMatch = Boolean(normalizedEmail) && normalizedEmail === normalizedConfirmation
  const emailMismatch = Boolean(emailConfirmation) && !emailsMatch
  const valid = sessions.length > 0 && company.trim() && emailsMatch && consent

  const toggleSession = (id) => setSessions((current) => (
    current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  ))

  const submit = async (event) => {
    event.preventDefault()
    if (!valid || status === 'submitting') return
    setStatus('submitting')
    setMessage('')
    try {
      let result
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        result = { registrationToken: registrationToken || crypto.randomUUID() }
      } else {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: company.trim(),
            email: normalizedEmail,
            emailConfirmation: normalizedConfirmation,
            registrationToken,
            sessions,
            environment,
            consent,
          }),
        })
        result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Registration could not be saved')
      }
      if (result.registrationToken) {
        saveRegistrationToken(result.registrationToken)
        setRegistrationToken(result.registrationToken)
      }
      setStatus('success')
      setMessage('Thanks. Your registration is saved. GitHub organization access details will be sent a few days before the event.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message)
    }
  }

  return (
    <form className={s.form} onSubmit={submit}>
      <div className={s.ticketNotice}>
        <span aria-hidden="true">GH</span>
        <div>
          <strong>GitHub organization access</strong>
          <p>A few days before the event, your invitation will include the link to join the event GitHub organization. The environment includes $100 of GitHub Copilot AI credits.</p>
        </div>
      </div>

      <div className={s.fields}>
        <label className={s.companyField}>
          <span>Company or organisation</span>
          <input required autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label>
          <span>Company email address</span>
          <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Re-enter company email address</span>
          <input
            required
            type="email"
            autoComplete="off"
            aria-invalid={emailMismatch}
            value={emailConfirmation}
            onChange={(e) => setEmailConfirmation(e.target.value)}
          />
          {emailConfirmation && <small className={emailsMatch ? s.emailMatch : s.emailMismatch}>{emailsMatch ? 'Email addresses match.' : 'Email addresses do not match.'}</small>}
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
            <span><strong>{option.label}</strong>{option.desc && <small>{option.desc}</small>}</span>
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
        <small>No GitHub sign-in is required. The organization invitation is sent to your confirmed company email.</small>
      </div>
      {message && <p className={`${s.message} ${status === 'error' ? s.error : ''}`} role="status">{message}</p>}
    </form>
  )
}
