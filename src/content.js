// Shared public content for the landing site and the deck.
// Topics, speakers and dates intentionally remain visible placeholders.

export const BOOTCAMP = {
  name: 'Foundry Agentic Development Winter Bootcamp',
  short: 'Foundry Winter Bootcamp',
  tagline: 'Build dependable agents with Microsoft Foundry.',
  subtitle:
    'A six-session community programme connecting agent design, models, knowledge, tools, orchestration, evaluation and responsible delivery with GitHub Copilot.',
  season: 'Winter',
  kickoffDate: 'Friday 4 December 2026 · placeholder schedule',
  kickoffLabel: 'Placeholder dates and times · TBC',
  kickoff: '2026-12-04T09:30:00+01:00',
  footer: 'Foundry Agentic Development Winter Bootcamp',
}

export const SESSIONS = [
  {
    id: 'session-01',
    number: '01',
    title: '[Session topic TBC]',
    shortTitle: 'Session 01',
    track: 'Foundations TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    owner: 'Nathan Brahmbhatt',
    ownerInitials: 'NB',
    ownerRole: 'Host and session owner',
    audience: 'All agent builders',
    format: 'Format TBC',
    scheduleMark: 'A1',
    accent: '#8ef5e5',
    spotlight: 'The foundations focus and hands-on challenge will be announced.',
    overview: 'This placeholder reserves the foundations session. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: ['Learning outcomes TBC', 'Hands-on activity TBC', 'Tools and prerequisites TBC'],
    tools: ['Azure AI Foundry', 'Microsoft Learn: Azure AI Foundry', 'GitHub Copilot'],
  },
  {
    id: 'session-02',
    number: '02',
    title: '[Session topic TBC]',
    shortTitle: 'Session 02',
    track: 'Models TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    owner: '[Agent architecture owner TBC]',
    ownerInitials: 'AA',
    ownerRole: 'Agent architecture',
    audience: 'AI application developers',
    format: 'Format TBC',
    scheduleMark: 'A2',
    accent: '#a7a0ff',
    spotlight: 'The models and architecture focus will be announced.',
    overview: 'This placeholder reserves a complete session in the programme. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: ['Learning outcomes TBC', 'Hands-on activity TBC', 'Tools and prerequisites TBC'],
    tools: ['Foundry Models', 'Model catalog', 'Prompt flow'],
  },
  {
    id: 'session-03',
    number: '03',
    title: '[Session topic TBC]',
    shortTitle: 'Session 03',
    track: 'Knowledge TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    owner: '[Knowledge and RAG owner TBC]',
    ownerInitials: 'KR',
    ownerRole: 'Knowledge and grounding',
    audience: 'AI and ML engineers',
    format: 'Format TBC',
    scheduleMark: 'A3',
    accent: '#63d9ff',
    spotlight: 'The knowledge, grounding and RAG focus will be announced.',
    overview: 'This placeholder reserves a complete session in the programme. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: ['Learning outcomes TBC', 'Hands-on activity TBC', 'Tools and prerequisites TBC'],
    tools: ['RAG', 'Foundry Knowledge', 'Microsoft Learn: Grounding'],
  },
  {
    id: 'session-04',
    number: '04',
    title: '[Session topic TBC]',
    shortTitle: 'Session 04',
    track: 'Tools TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    owner: '[Tool orchestration owner TBC]',
    ownerInitials: 'TO',
    ownerRole: 'Tools and orchestration',
    audience: 'Platform engineers',
    format: 'Format TBC',
    scheduleMark: 'A4',
    accent: '#d29cff',
    spotlight: 'The tools, orchestration and approval focus will be announced.',
    overview: 'This placeholder reserves a complete session in the programme. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: ['Learning outcomes TBC', 'Hands-on activity TBC', 'Tools and prerequisites TBC'],
    tools: ['Foundry Agent Service', 'Tool calling', 'Human approval'],
  },
  {
    id: 'session-05',
    number: '05',
    title: '[Session topic TBC]',
    shortTitle: 'Session 05',
    track: 'Evaluation TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    owner: '[Evaluation owner TBC]',
    ownerInitials: 'EV',
    ownerRole: 'Evaluation and safety',
    audience: 'Responsible AI teams',
    format: 'Format TBC',
    scheduleMark: 'A5',
    accent: '#69f2c1',
    spotlight: 'The evaluation, responsible AI and safety focus will be announced.',
    overview: 'This placeholder reserves a complete session in the programme. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: ['Learning outcomes TBC', 'Hands-on activity TBC', 'Tools and prerequisites TBC'],
    tools: ['Foundry Evaluation', 'Responsible AI', 'Safety evaluations'],
  },
  {
    id: 'session-06',
    number: '06',
    title: '[Session topic TBC]',
    shortTitle: 'Session 06',
    track: 'Production TBC',
    subtitle: 'Session details will be added when the programme is confirmed.',
    owner: '[Production owner TBC]',
    ownerInitials: 'PR',
    ownerRole: 'Production and observability',
    audience: 'Technical product and build teams',
    format: 'Format TBC',
    scheduleMark: 'A6',
    accent: '#8fc8ff',
    spotlight: 'The production, observability and deployment focus will be announced.',
    overview: 'This placeholder reserves a complete session in the programme. The confirmed description, examples, prerequisites and practical activity will be added here.',
    outcomes: ['Learning outcomes TBC', 'Hands-on activity TBC', 'Tools and prerequisites TBC'],
    tools: ['Tracing and observability', 'Production deployment', 'Azure monitoring'],
  },
]

export const PLACEHOLDER_DATES = [
  { iso: '2026-12-04', label: 'Fri 4 Dec 2026' },
  { iso: '2026-12-11', label: 'Fri 11 Dec 2026' },
  { iso: '2026-12-18', label: 'Fri 18 Dec 2026' },
  { iso: '2027-01-08', label: 'Fri 8 Jan 2027' },
  { iso: '2027-01-15', label: 'Fri 15 Jan 2027' },
  { iso: '2027-01-22', label: 'Fri 22 Jan 2027' },
]

export const SESSION_TIMES = {
  'session-01': '09:30',
  'session-02': '10:30',
  'session-03': '11:30',
  'session-04': '13:00',
  'session-05': '14:00',
  'session-06': '15:00',
}

export const SCHEDULE = PLACEHOLDER_DATES.map((date, index) => ({
  id: `date-${date.iso}`,
  number: String(index + 1).padStart(2, '0'),
  dateIso: date.iso,
  date: date.label,
  weekday: 'Friday',
  status: 'placeholder · TBC',
  sessions: SESSIONS.map((session) => ({
    ...session,
    time: SESSION_TIMES[session.id],
    selection: `${date.iso}|${SESSION_TIMES[session.id]}|${session.id}`,
  })),
}))

export const REGISTRATION_CHOICES = SCHEDULE.flatMap((date) => date.sessions.map((session) => ({
  value: session.selection,
  dateIso: date.dateIso,
  date: date.date,
  sessionId: session.id,
  number: session.number,
  time: session.time,
  title: session.title,
})))

export const PERSONAS = [
  {
    id: 'builders', icon: 'AD', label: 'AI application developers',
    desc: 'Turn models and tools into useful, dependable agent behaviour.',
    does: 'Build agents around user outcomes, Foundry projects, trusted knowledge, bounded tools and observable runtime decisions.',
    stack: ['Azure AI Foundry', 'Models', 'RAG', 'Tools', 'Evals'],
  },
  {
    id: 'architecture', icon: 'SA', label: 'Solution & cloud architects',
    desc: 'Shape the runtime, integration and operational boundaries.',
    does: 'Compare model routes, orchestration patterns, approvals, safety controls and platform integration choices.',
    stack: ['Azure AI Foundry', 'APIs', 'Identity', 'Observability'],
  },
  {
    id: 'engineering', icon: 'PE', label: 'Platform & AI/ML engineers',
    desc: 'Build the secure foundations, knowledge connections and operational path.',
    does: 'Prepare environments, integrate data and tools, and make agent behavior observable in production.',
    stack: ['Platform', 'AI/ML', 'RAG', 'Safety', 'Monitoring'],
  },
  {
    id: 'product', icon: 'PB', label: 'Technical product & build teams',
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

export const GITHUB_ACCESS = {
  eyebrow: 'GitHub organization access',
  title: 'Event organization access and $100 of GitHub Copilot AI credits.',
  description:
    'A few days before the event starts, registered attendees will receive an invitation containing the link to join the event GitHub organization. The event environment includes $100 worth of AI credits to use with GitHub Copilot.',
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
  { id: 'github', icon: 'GH', title: 'GitHub account ready', desc: 'Use the GitHub.com account that will accept the event organization invitation.' },
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
  { id: 'agents', label: 'Foundry Agent Service', check: 'Review agent service concepts', login: 'Workshop access requirements TBC', href: 'https://learn.microsoft.com/azure/foundry/agents/' },
  { id: 'evaluation', label: 'Foundry evaluation', check: 'Review evaluation concepts', login: 'No sign-in required for guidance', href: 'https://learn.microsoft.com/azure/foundry/concepts/evaluation-approach-gen-ai' },
  { id: 'responsible-ai', label: 'Responsible AI', check: 'Review safety guidance', login: 'No sign-in required for guidance', href: 'https://learn.microsoft.com/azure/ai-foundry/responsible-use-of-ai-overview' },
  { id: 'github-mcp', label: 'GitHub MCP Server', check: '/mcp', login: 'Verify GitHub MCP is connected', href: 'https://github.com/github/github-mcp-server' },
]

export const READINESS_PATHS = [
  {
    id: 'ready',
    number: '01',
    title: 'Skip the foundations walkthrough when every check passes',
    desc: 'If your local tools, access and sample environment are already ready, move directly to the confirmed session prerequisites.',
  },
  {
    id: 'guided',
    number: '02',
    title: 'Use foundations and guided setup when anything is pending',
    desc: 'Complete the readiness checklist and guided setup before relying on the hands-on environment.',
  },
  {
    id: 'cloud',
    number: '03',
    title: 'Cloud access remains subject to confirmed capacity and quotas',
    desc: 'Selecting cloud records your need; it does not guarantee allocation until workshop capacity and Foundry quotas are confirmed.',
  },
]

export const TEAM = [
  { id: 'host', initials: 'NB', name: 'Nathan Brahmbhatt', role: 'Host', focus: 'Bootcamp host and programme coordination' },
  { id: 'architecture', initials: 'AA', name: '[Agent architecture owner TBC]', role: 'Session owner', focus: 'Agent architecture and models' },
  { id: 'knowledge', initials: 'KR', name: '[Knowledge and RAG owner TBC]', role: 'Session owner', focus: 'Knowledge, grounding and RAG' },
  { id: 'tools', initials: 'TO', name: '[Tool orchestration owner TBC]', role: 'Session owner', focus: 'Tools, orchestration and approvals' },
  { id: 'evaluation', initials: 'EV', name: '[Evaluation owner TBC]', role: 'Session owner', focus: 'Evaluation, safety and responsible AI' },
  { id: 'production', initials: 'PR', name: '[Production owner TBC]', role: 'Session owner', focus: 'Observability and production deployment' },
]

export const FAQ = [
  {
    q: 'Who is this for?',
    a: 'AI application developers, solution and cloud architects, platform engineers, AI/ML engineers, and technical product or build teams.',
  },
  {
    q: 'What are the session topics?',
    a: 'The programme will contain six sessions. Topics, hands-on activities and prerequisites are still being confirmed.',
  },
  {
    q: 'When does it start?',
    a: 'The public schedule currently uses six Friday placeholder dates and times so registration can be tested end to end. Every date and time remains TBC until confirmed.',
  },
  {
    q: 'Will the sessions be hands-on?',
    a: 'The final format will be published with each session. Expect application-first examples rather than product-only presentations.',
  },
  {
    q: 'What is included with the event GitHub environment?',
    a: 'You receive access to the event GitHub organization and $100 worth of AI credits to use with GitHub Copilot.',
  },
  {
    q: 'How do I access the GitHub organization?',
    a: 'A few days before the event starts, your event invitation will include the link used to join the organization.',
  },
  {
    q: 'How do I register?',
    a: 'Provide and confirm your company email, choose your sessions and select your development environment. No GitHub sign-in is required on this website.',
  },
]

export const REGISTER_STEPS = [
  'Enter and confirm your company email address',
  'Choose placeholder date, time and session combinations plus the development environment you need',
  'Receive the GitHub organization invitation link a few days before the event',
]

export const REGISTRATION = {
  eyebrow: 'Registration',
  title: 'Join the Foundry Agentic Development Winter Bootcamp.',
  subtitle: 'Confirm your company email, choose placeholder date and session combinations, and provide the details needed for event access.',
  environments: [
    {
      id: 'local',
      label: 'I will use a local development environment',
      desc: 'Choose this if your readiness checks already pass or you will use the foundations and guided setup path.',
    },
    {
      id: 'cloud',
      label: 'I need a cloud development environment',
      desc: 'Cloud access is subject to confirmed workshop capacity and Foundry quotas; selecting this records your need but does not guarantee allocation.',
    },
  ],
  slotHelp: 'Every placeholder Friday runs the same six-session agenda. Choose the specific date and session times that work for you.',
  consent:
    'I consent to Microsoft using my company, company email, session choices and environment preference to administer the bootcamp, send the GitHub organization invitation, provision access, communicate with me and improve the programme. Registration data is deleted after the administration period.',
}
