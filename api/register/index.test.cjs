const assert = require('node:assert/strict')
const { createHash } = require('node:crypto')
const test = require('node:test')
const register = require('./index.js')
const siteState = require('../site-state.json')

const registrationToken = '123e4567-e89b-42d3-a456-426614174000'
const DATES = ['2026-12-04', '2026-12-11', '2026-12-18', '2027-01-08', '2027-01-15', '2027-01-22']
const SESSIONS = [
  ['foundations', '09:00'],
  ['advanced-patterns', '10:00'],
  ['evaluate', '11:00'],
  ['deploy', '12:30'],
  ['operate', '13:30'],
  ['govern', '14:30'],
]

function request(body) {
  return { headers: {}, body }
}

function validBody() {
  return {
    company: 'Example Org',
    email: 'Builder@Example.com',
    emailConfirmation: 'builder@example.com',
    registrationToken,
    sessions: [
      '2026-12-04|09:00|foundations',
      '2027-01-22|14:30|govern',
    ],
    environment: 'cloud',
    consent: true,
  }
}

function configuredEnvironment() {
  process.env.REGISTRATION_FLOW_URL = 'https://flow.example.test/register'
  process.env.REGISTRATION_FLOW_SHARED_SECRET = 'test-only-secret'
}

test('rejects mismatched email confirmation', async () => {
  configuredEnvironment()
  const context = {}
  const body = validBody()
  body.emailConfirmation = 'different@example.com'
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('rejects duplicate date-time-session selections', async () => {
  configuredEnvironment()
  const context = {}
  const body = validBody()
  body.sessions = [
    '2026-12-04|09:00|foundations',
    '2026-12-04|09:00|foundations',
  ]
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('rejects an unknown date-time-session selection', async () => {
  configuredEnvironment()
  const context = {}
  const body = validBody()
  body.sessions = ['2026-12-05|09:00|foundations']
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('rejects a valid date paired with the wrong session time', async () => {
  configuredEnvironment()
  const context = {}
  const body = validBody()
  body.sessions = ['2026-12-04|10:00|foundations']
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('rejects the retired placeholder selections', async () => {
  configuredEnvironment()
  const context = {}
  const body = validBody()
  body.sessions = ['2026-12-04|09:30|session-01']
  await register(context, request(body))
  assert.equal(context.res.status, 400)
})

test('accepts every session on every date', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (url, options) => {
    received = JSON.parse(options.body)
    return { ok: true }
  }
  const body = validBody()
  body.sessions = DATES.flatMap((date) => SESSIONS.map(([id, time]) => `${date}|${time}|${id}`))
  const context = {}
  await register(context, request(body))
  assert.equal(context.res.status, 202)
  assert.equal(received.sessionSelections.length, 36)
})

test('refuses registrations while registration is paused (state 2)', async () => {
  configuredEnvironment()
  let called = false
  global.fetch = async () => {
    called = true
    return { ok: true }
  }
  const original = siteState.registration
  siteState.registration = 2
  try {
    const context = {}
    await register(context, request(validBody()))
    assert.equal(context.res.status, 403)
    assert.equal(called, false)
  } finally {
    siteState.registration = original
  }
})

test('requires shared backend settings', async () => {
  delete process.env.REGISTRATION_FLOW_URL
  delete process.env.REGISTRATION_FLOW_SHARED_SECRET
  const context = {}
  await register(context, request(validBody()))
  assert.equal(context.res.status, 503)
})

test('forwards an anonymous event-routed upsert payload', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (url, options) => {
    received = { url, options, body: JSON.parse(options.body) }
    return { ok: true }
  }

  const context = {}
  await register(context, request(validBody()))

  assert.equal(context.res.status, 202)
  assert.equal(String(received.url), 'https://flow.example.test/register')
  assert.equal(received.options.headers['x-registration-secret'], 'test-only-secret')
  assert.equal(received.body.eventId, 'foundry-agentic-development-winter-bootcamp')
  assert.equal(received.body.companyEmail, 'builder@example.com')
  assert.deepEqual(received.body.sessionSelections, validBody().sessions)
  assert.equal(received.body.environmentPreference, 'cloud')
  assert.equal('githubUserId' in received.body, false)
  assert.equal('githubUsername' in received.body, false)
  assert.equal('email' in received.body, false)
  assert.equal('sessions' in received.body, false)
  assert.equal('environment' in received.body, false)
  assert.equal(
    received.body.registrationId,
    createHash('sha256').update(`foundry-agentic-development-winter-bootcamp:${registrationToken}`).digest('hex'),
  )
  assert.equal(
    received.body.registrationEmailKey,
    createHash('sha256').update('foundry-agentic-development-winter-bootcamp:builder@example.com').digest('hex'),
  )
  assert.equal(context.res.body.registrationToken, registrationToken)
  assert.equal('registrationEmailKey' in context.res.body, false)
})

test('normalizes company email before deriving the deterministic downstream email key', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (url, options) => {
    received = { url, body: JSON.parse(options.body) }
    return { ok: true }
  }

  const body = validBody()
  body.email = '  BUILDER@Example.COM  '
  body.emailConfirmation = 'builder@example.com'
  const context = {}
  await register(context, request(body))

  assert.equal(context.res.status, 202)
  assert.equal(received.body.companyEmail, 'builder@example.com')
  assert.equal(
    received.body.registrationEmailKey,
    createHash('sha256').update('foundry-agentic-development-winter-bootcamp:builder@example.com').digest('hex'),
  )
})

test('ignores caller attempts to override server-derived registration identifiers', async () => {
  configuredEnvironment()
  let received
  global.fetch = async (url, options) => {
    received = { url, body: JSON.parse(options.body) }
    return { ok: true }
  }

  const body = {
    ...validBody(),
    registrationId: 'caller-registration-id',
    registrationEmailKey: 'caller-email-key',
  }
  const context = {}
  await register(context, request(body))

  assert.equal(context.res.status, 202)
  assert.equal(
    received.body.registrationId,
    createHash('sha256').update(`foundry-agentic-development-winter-bootcamp:${registrationToken}`).digest('hex'),
  )
  assert.equal(
    received.body.registrationEmailKey,
    createHash('sha256').update('foundry-agentic-development-winter-bootcamp:builder@example.com').digest('hex'),
  )
  assert.equal(context.res.body.registrationToken, registrationToken)
  assert.equal('registrationId' in context.res.body, false)
  assert.equal('registrationEmailKey' in context.res.body, false)
})
