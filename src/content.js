// Shared public content for the landing site and the deck.
// Topics, speakers and dates intentionally remain visible placeholders.

export const BOOTCAMP = {
  name: 'Foundry Agentic Development Winter Bootcamp',
  short: 'Foundry Winter Bootcamp',
  tagline: 'Build dependable agents with Microsoft Foundry.',
  subtitle:
    'A six-session community programme connecting agent design, models, knowledge, tools, orchestration, evaluation and responsible delivery with GitHub Copilot.',
  season: 'Winter',
  kickoffDate: null,
  kickoffLabel: 'Dates to be announced',
  kickoff: null,
  footer: 'Foundry Agentic Development Winter Bootcamp',
}

const ACCENTS = ['#8ef5e5', '#a7a0ff', '#63d9ff', '#d29cff', '#69f2c1', '#8fc8ff']

export const SESSIONS = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return {
    id: `session-${number}`,
    number,
    title: '[Session topic TBC]',
    shortTitle: `Session ${number}`,
    track: 'Topic TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    lead: '[Speaker TBC]',
    audience: 'Agent builder community',
    format: 'Format TBC',
    scheduleMark: `A${index + 1}`,
    accent: ACCENTS[index],
    spotlight: 'The session focus and hands-on challenge will be announced.',
    overview:
      'This placeholder reserves a complete session in the programme. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: [
      'Learning outcomes TBC',
      'Hands-on activity TBC',
      'Tools and prerequisites TBC',
    ],
    tools: ['Tools TBC'],
  }
})

export const SCHEDULE = SESSIONS.map((session) => ({
  ...session,
  dateIso: null,
  date: 'Date TBC',
  status: 'to be announced',
}))

export const PERSONAS = [
  {
    id: 'builders', icon: 'FD', label: 'Foundry agent developers',
    desc: 'Turn models and tools into useful, dependable agent behaviour.',
    does: 'Build agents around user outcomes, Foundry projects, trusted knowledge, bounded tools and observable runtime decisions.',
    stack: ['Foundry', 'Models', 'Knowledge', 'Tools', 'Evals'],
  },
  {
    id: 'architecture', icon: 'AR', label: 'Architects & platform teams',
    desc: 'Shape the runtime, integration and operational boundaries.',
    does: 'Compare model routes, orchestration patterns, approvals, safety controls and platform integration choices.',
    stack: ['Foundry', 'APIs', 'Identity', 'Observability'],
  },
  {
    id: 'product', icon: 'PX', label: 'Product & technical leaders',
    desc: 'Connect agent autonomy to measurable product value.',
    does: 'Frame the job, define success, understand risk and build evaluation into the product lifecycle.',
    stack: ['Intent', 'Quality', 'Safety', 'Iteration'],
  },
]

export const PILLARS = [
  {
    id: 'job',
    icon: '01',
    title: 'Start with the agent’s job',
    desc: 'Frame the user outcome, operating boundary and approval model before choosing implementation details.',
  },
  {
    id: 'loop',
    icon: '02',
    title: 'Build on a governed runtime',
    desc: 'Make Foundry models, knowledge, tools, state, retries and human hand-offs understandable.',
  },
  {
    id: 'evaluate',
    icon: '03',
    title: 'Evaluate every run',
    desc: 'Treat groundedness, task success, safety, latency and iteration as product capabilities.',
  },
]

export const GOLDEN_TICKET = {
  eyebrow: 'GitHub Golden Ticket',
  title: 'Event organization access and $100 of GitHub Copilot AI credits.',
  description:
    'A few days before the event starts, registered attendees will receive an invitation containing the link to join the event GitHub organization. The Golden Ticket environment includes $100 worth of AI credits to use with GitHub Copilot.',
}

export const PIPELINE = [
  {
    id: 'intent', label: 'Intent', sub: 'job', color: '#8ef5e5',
    what: 'Define the user outcome, success condition and operating boundary.',
    prompt: 'Turn this product idea into a bounded agent job and measurable success criteria.',
    gate: 'Job is testable',
  },
  {
    id: 'model', label: 'Models', sub: 'route', color: '#a7a0ff',
    what: 'Select capabilities, latency and cost that fit each step of the experience.',
    prompt: 'Compare model routes for quality, latency and cost.',
    gate: 'Route justified',
  },
  {
    id: 'ground', label: 'Knowledge', sub: 'ground', color: '#63d9ff',
    what: 'Connect trusted knowledge and application state without losing provenance.',
    prompt: 'Design a grounding strategy with clear source attribution.',
    gate: 'Context traceable',
  },
  {
    id: 'tools', label: 'Tools', sub: 'actions', color: '#d29cff',
    what: 'Give the agent narrowly scoped actions with explicit approvals and verification.',
    prompt: 'Define the smallest safe tool surface for this task.',
    gate: 'Actions bounded',
  },
  {
    id: 'eval', label: 'Evaluate', sub: 'learn', color: '#69f2c1',
    what: 'Measure task success, safety and operational quality on every run.',
    prompt: 'Create an evaluation set and the signals needed before release.',
    gate: 'Quality visible',
  },
]

export const TERMINAL_SCRIPTS = [
  {
    workspace: '~/agent-intent',
    prompt: 'Turn this support workflow into a bounded agent job with clear success criteria and escalation rules',
    lines: [
      { kind: 'info', text: 'Reading product intent', meta: 'support-agent.md' },
      { kind: 'ok', text: 'success criteria', meta: '4 measurable outcomes' },
      { kind: 'ok', text: 'operating boundary', meta: '3 escalation paths' },
      { kind: 'done', text: 'Agent job ready for review' },
    ],
  },
  {
    workspace: '~/model-routing',
    prompt: 'Compare model routes for this agent across quality, latency and cost',
    lines: [
      { kind: 'info', text: 'Reading task profile', meta: '12 representative runs' },
      { kind: 'ok', text: 'fast route', meta: 'low latency' },
      { kind: 'ok', text: 'reasoning route', meta: 'complex decisions only' },
      { kind: 'done', text: 'Routing policy ready to evaluate' },
    ],
  },
  {
    workspace: '~/tool-runtime',
    prompt: 'Design a safe tool-using agent with approval before external actions',
    lines: [
      { kind: 'info', text: 'Mapping actions', meta: 'read · draft · submit' },
      { kind: 'ok', text: 'tool schemas', meta: 'bounded inputs' },
      { kind: 'ok', text: 'approval gate', meta: 'submit action protected' },
      { kind: 'done', text: 'Runtime ready for simulation' },
    ],
  },
  {
    workspace: '~/evaluation',
    prompt: 'Create an evaluation set for groundedness, task success, safety and latency',
    lines: [
      { kind: 'info', text: 'Sampling representative runs', meta: '40 cases' },
      { kind: 'ok', text: 'groundedness evaluator', meta: 'source-aware' },
      { kind: 'ok', text: 'task success evaluator', meta: 'outcome-based' },
      { kind: 'ok', text: 'safety and latency', meta: 'thresholds set' },
      { kind: 'done', text: 'Evaluation plan ready' },
    ],
  },
]

export const PREP = [
  { id: 'github', icon: 'GH', title: 'GitHub account ready', desc: 'Use the GitHub.com account that will accept the Golden Ticket organization invitation.' },
  { id: 'copilot', icon: 'AI', title: 'GitHub Copilot access', desc: 'Bring an active Copilot plan through your organisation, education access or individual subscription.' },
  { id: 'node', icon: 'JS', title: 'Node.js LTS', desc: 'Use a supported Node.js release for the sample agent application and tooling.' },
  { id: 'python', icon: 'PY', title: 'Supported Python', desc: 'Some agent and evaluation examples may use Python; confirmed versions will be published with the sessions.' },
  { id: 'foundry', icon: 'MF', title: 'Microsoft Foundry access TBC', desc: 'Any required Foundry project, model or Agent Service access will be confirmed before the hands-on sessions.' },
  { id: 'sample', icon: 'DATA', title: 'Sample content only', desc: 'Use workshop or non-sensitive data. Do not bring credentials, personal data or confidential production content.' },
]

export const SETUP_RESOURCES = [
  { id: 'gh', label: 'GitHub CLI', check: 'gh --version', login: 'gh auth login', href: 'https://cli.github.com/' },
  { id: 'node', label: 'Node.js LTS', check: 'node --version', login: 'No sign-in required', href: 'https://nodejs.org/' },
  { id: 'python', label: 'Python', check: 'python --version', login: 'No sign-in required', href: 'https://www.python.org/downloads/' },
  { id: 'copilot', label: 'GitHub Copilot CLI', check: 'copilot --version', login: 'copilot', href: 'https://docs.github.com/copilot' },
  { id: 'foundry', label: 'Microsoft Foundry', check: 'Access requirements TBC', login: 'Use the workshop project when supplied', href: 'https://learn.microsoft.com/azure/foundry/' },
  { id: 'github-mcp', label: 'GitHub MCP Server', check: '/mcp', login: 'Verify GitHub MCP is connected', href: 'https://github.com/github/github-mcp-server' },
]

export const FAQ = [
  {
    q: 'Who is this for?',
    a: 'Developers, architects, product builders, platform teams, technical leaders and curious practitioners building AI applications.',
  },
  {
    q: 'Is this only for Microsoft developers?',
    a: 'No. Microsoft Foundry is the primary platform, while the programme teaches transferable agent design, evaluation and delivery practices.',
  },
  {
    q: 'What are the session topics?',
    a: 'The programme will contain six sessions. Topics, hands-on activities and prerequisites are still being confirmed.',
  },
  {
    q: 'When does it start?',
    a: 'Dates and start times are still to be announced.',
  },
  {
    q: 'Will the sessions be hands-on?',
    a: 'The final format will be published with each session. Expect application-first examples rather than product-only presentations.',
  },
  {
    q: 'What is included with the Golden Ticket environment?',
    a: 'You receive access to the event GitHub organization and $100 worth of AI credits to use with GitHub Copilot.',
  },
  {
    q: 'How do I access the GitHub organization?',
    a: 'A few days before the event starts, your event invitation will include the Golden Ticket link used to join the organization.',
  },
  {
    q: 'How do I register?',
    a: 'Provide and confirm your company email, choose your sessions and select your development environment. No GitHub sign-in is required on this website.',
  },
]

export const REGISTER_STEPS = [
  'Enter and confirm your company email address',
  'Choose the sessions and development environment you need',
  'Receive the Golden Ticket organization link a few days before the event',
]

export const REGISTRATION = {
  eyebrow: 'Registration',
  title: 'Join the Foundry Agentic Development Winter Bootcamp.',
  subtitle: 'Confirm your company email, choose your sessions and provide the details needed for event access.',
  environments: [
    { id: 'local', label: 'I will use a local development environment' },
    { id: 'cloud', label: 'I need a cloud development environment' },
  ],
  consent:
    'I consent to Microsoft using my company, company email, session choices and environment preference to administer the bootcamp, send the Golden Ticket organization invitation, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period.',
}
