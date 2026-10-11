// Shared public content for the landing site and the deck.
// Topics, speakers and dates intentionally remain visible placeholders.

export const BOOTCAMP = {
  name: 'Agentic AI Apps Winter Bootcamp',
  short: 'Winter Bootcamp',
  tagline: 'Build dependable agents beyond the demo.',
  subtitle:
    'A six-session community programme exploring models, grounding, tools, orchestration, evaluation and responsible delivery.',
  season: 'Winter',
  kickoffDate: null,
  kickoffLabel: 'Dates to be announced',
  kickoff: null,
  footer: 'Agentic AI Apps Winter Bootcamp',
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
    id: 'builders', icon: 'AG', label: 'AI app developers',
    desc: 'Turn model capability into useful application behaviour.',
    does: 'Design agents around user outcomes, grounded context, bounded tools and observable runtime decisions.',
    stack: ['Models', 'Grounding', 'Tools', 'Agents', 'Evals'],
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
    title: 'Design the control loop',
    desc: 'Make models, context, tools, state, retries and human hand-offs understandable.',
  },
  {
    id: 'evaluate',
    icon: '03',
    title: 'Evaluate every run',
    desc: 'Treat groundedness, task success, safety, latency and iteration as product capabilities.',
  },
]

export const PIPELINE = [
  {
    id: 'intent', label: 'Intent', sub: 'job', color: '#8ef5e5',
    what: 'Define the user outcome, success condition and operating boundary.',
    prompt: 'Turn this product idea into a bounded agent job and measurable success criteria.',
    gate: 'Job is testable',
  },
  {
    id: 'model', label: 'Model', sub: 'route', color: '#a7a0ff',
    what: 'Select capabilities, latency and cost that fit each step of the experience.',
    prompt: 'Compare model routes for quality, latency and cost.',
    gate: 'Route justified',
  },
  {
    id: 'ground', label: 'Ground', sub: 'context', color: '#63d9ff',
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
  { id: 'github', icon: 'GH', title: 'GitHub account ready', desc: 'Use the GitHub identity you want associated with registration and workshop activity.' },
  { id: 'copilot', icon: 'AI', title: 'GitHub Copilot access', desc: 'Bring an active Copilot plan through your organisation, education access or individual subscription.' },
  { id: 'node', icon: 'JS', title: 'Node.js LTS', desc: 'Use a supported Node.js release for the sample agent application and tooling.' },
  { id: 'python', icon: 'PY', title: 'Supported Python', desc: 'Some agent and evaluation examples may use Python; confirmed versions will be published with the sessions.' },
  { id: 'foundry', icon: 'AF', title: 'Foundry access TBC', desc: 'Any required Microsoft Foundry project or model access will be confirmed before the hands-on sessions.' },
  { id: 'sample', icon: 'DATA', title: 'Sample content only', desc: 'Use workshop or non-sensitive data. Do not bring credentials, personal data or confidential production content.' },
]

export const SETUP_RESOURCES = [
  { id: 'gh', label: 'GitHub CLI', check: 'gh --version', login: 'gh auth login', href: 'https://cli.github.com/' },
  { id: 'node', label: 'Node.js LTS', check: 'node --version', login: 'No sign-in required', href: 'https://nodejs.org/' },
  { id: 'python', label: 'Python', check: 'python --version', login: 'No sign-in required', href: 'https://www.python.org/downloads/' },
  { id: 'copilot', label: 'GitHub Copilot CLI', check: 'copilot --version', login: 'copilot', href: 'https://docs.github.com/copilot' },
  { id: 'foundry', label: 'Microsoft Foundry', check: 'Access requirements TBC', login: 'Use the workshop project when supplied', href: 'https://ai.azure.com/' },
  { id: 'github-mcp', label: 'GitHub MCP Server', check: '/mcp', login: 'Verify GitHub MCP is connected', href: 'https://github.com/github/github-mcp-server' },
]

export const FAQ = [
  {
    q: 'Who is this for?',
    a: 'Developers, architects, product builders, platform teams, technical leaders and curious practitioners building AI applications.',
  },
  {
    q: 'Is this only for Microsoft developers?',
    a: 'No. Microsoft Foundry inspires several examples, while the programme is framed around transferable agent design and delivery practices.',
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
    q: 'How do I register?',
    a: 'Sign in with GitHub, provide the event details needed for administration and select the sessions you plan to attend.',
  },
]

export const REGISTER_STEPS = [
  'Sign in with your personal GitHub.com account',
  'Confirm the sessions you plan to attend and add your company details',
  'Receive setup guidance and access information by email',
]

export const REGISTRATION = {
  eyebrow: 'Registration',
  title: 'Join the Agentic AI Apps Winter Bootcamp.',
  subtitle: 'Sign in with GitHub, confirm your sessions and provide the details needed for event access.',
  environments: [
    { id: 'local', label: 'I will use a local development environment' },
    { id: 'cloud', label: 'I need a cloud development environment' },
  ],
  consent:
    'I consent to Microsoft using my company, company email, session choices, GitHub.com username and environment preference to administer the bootcamp, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period.',
}
