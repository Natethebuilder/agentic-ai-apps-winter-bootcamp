const { createHash, randomUUID } = require('node:crypto')
const siteState = require('../site-state.json')

const EVENT_ID = 'foundry-agentic-development-winter-bootcamp'
const SESSION_DATES = ['2026-12-04', '2026-12-11', '2026-12-18', '2027-01-08', '2027-01-15', '2027-01-22']
const SESSION_TIMES = {
  foundations: '09:00',
  'advanced-patterns': '10:00',
  evaluate: '11:00',
  deploy: '12:30',
  operate: '13:30',
  govern: '14:30',
}
const SESSION_SELECTIONS = new Set(SESSION_DATES.flatMap((date) => (
  Object.entries(SESSION_TIMES).map(([sessionId, time]) => `${date}|${time}|${sessionId}`)
)))
const ENVIRONMENTS = new Set(['local', 'cloud'])
const REGISTRATION_TOKEN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function response(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body,
  }
}

module.exports = async function register(context, req) {
  // State 2 in api/site-state.json pauses registration without removing the working flow.
  if (siteState.registration === 2) {
    context.res = response(403, { error: 'Registration will open soon.' })
    return
  }

  const body = req.body || {}
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const emailConfirmation = typeof body.emailConfirmation === 'string' ? body.emailConfirmation.trim().toLowerCase() : ''
  const suppliedToken = typeof body.registrationToken === 'string' ? body.registrationToken.trim() : ''
  const requestedSessions = Array.isArray(body.sessions) ? body.sessions : []
  const sessions = [...new Set(requestedSessions.filter((selection) => SESSION_SELECTIONS.has(selection)))]
  const environment = ENVIRONMENTS.has(body.environment) ? body.environment : ''

  if (!company || company.length > 160) {
    context.res = response(400, { error: 'Enter a valid company or organisation.' })
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    context.res = response(400, { error: 'Enter a valid company email address.' })
    return
  }
  if (email !== emailConfirmation) {
    context.res = response(400, { error: 'The company email addresses must match.' })
    return
  }
  if (suppliedToken && !REGISTRATION_TOKEN.test(suppliedToken)) {
    context.res = response(400, { error: 'The registration session is invalid. Refresh the page and try again.' })
    return
  }
  if (!sessions.length || sessions.length !== requestedSessions.length) {
    context.res = response(400, { error: 'Choose at least one valid date and session time.' })
    return
  }
  if (!environment || body.consent !== true) {
    context.res = response(400, { error: 'Choose an environment and provide data consent.' })
    return
  }

  const flowUrl = process.env.REGISTRATION_FLOW_URL
  const flowSecret = process.env.REGISTRATION_FLOW_SHARED_SECRET
  if (!flowUrl || !flowSecret) {
    context.res = response(503, { error: 'Registration storage is not configured yet.' })
    return
  }

  let parsedFlowUrl
  try {
    parsedFlowUrl = new URL(flowUrl)
  } catch {
    context.res = response(503, { error: 'Registration storage is not configured correctly.' })
    return
  }
  if (parsedFlowUrl.protocol !== 'https:') {
    context.res = response(503, { error: 'Registration storage requires a secure endpoint.' })
    return
  }

  const registrationToken = suppliedToken || randomUUID()
  const registrationId = createHash('sha256').update(`${EVENT_ID}:${registrationToken}`).digest('hex')
  const registrationEmailKey = createHash('sha256').update(`${EVENT_ID}:${email}`).digest('hex')
  const payload = {
    eventId: EVENT_ID,
    registrationId,
    registrationEmailKey,
    company,
    companyEmail: email,
    sessionSelections: sessions,
    environmentPreference: environment,
    consent: true,
    updatedAt: new Date().toISOString(),
  }

  let flowResponse
  try {
    flowResponse = await fetch(parsedFlowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-registration-secret': flowSecret,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    context.res = response(502, { error: 'Registration storage is temporarily unavailable.' })
    return
  }

  if (!flowResponse.ok) {
    context.res = response(502, { error: 'Registration storage rejected the request.' })
    return
  }

  context.res = response(202, { ok: true, registrationToken })
}
