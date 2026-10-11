export const EVENT = {
  id: 'agentic-ai-apps-winter-bootcamp-2026',
  name: 'Agentic AI Apps Winter Bootcamp',
  eyebrow: 'Six community sessions · programme in development',
  summary: 'Build dependable agents with models, tools, orchestration and evaluation practices that travel across frameworks and platforms.',
  date: 'Dates to be confirmed',
  format: 'Online · community learning series',
  audience: 'Developers, architects, product builders, technical leaders and curious practitioners',
}

export const VALUE = [
  {
    number: '01',
    title: 'Start with the agent’s job',
    text: 'Frame the user outcome and operating boundary before choosing a model or orchestration pattern.',
  },
  {
    number: '02',
    title: 'Design the control loop',
    text: 'Make tools, state, approvals and hand-offs explicit so autonomy remains understandable.',
  },
  {
    number: '03',
    title: 'Evaluate every run',
    text: 'Treat traces, quality, safety and iteration as product capabilities rather than launch-day checks.',
  },
]

export const SESSIONS = Array.from({ length: 6 }, (_, index) => ({
  id: `session-${index + 1}`,
  number: String(index + 1).padStart(2, '0'),
  topic: '[Topic to be confirmed]',
  date: 'Date TBC',
  time: 'Time TBC',
  speaker: 'Speaker TBC',
  headshot: 'Headshot placeholder',
  description: 'Session details will be published when the programme and speaker are confirmed.',
}))

export const BUILD_LOOP = [
  { id: 'intent', label: 'Intent', detail: 'Define the agent’s job, success condition and operating boundary.' },
  { id: 'model', label: 'Model', detail: 'Route each step to capabilities, latency and cost that fit the work.' },
  { id: 'tools', label: 'Tools', detail: 'Ground the agent in trusted context and narrowly scoped actions.' },
  { id: 'agent', label: 'Orchestrate', detail: 'Manage plans, state, retries, approvals and specialist hand-offs.' },
  { id: 'eval', label: 'Evaluate', detail: 'Measure task success, safety and operational behavior on every run.' },
]

export const AGENT_PATTERNS = [
  {
    id: 'assistant',
    label: 'Guided assistant',
    description: 'One agent proposes the next step while a person stays in control.',
    route: ['Understand', 'Suggest', 'Approve', 'Act'],
    scores: { autonomy: 35, traceability: 94, coordination: 28 },
  },
  {
    id: 'tool-agent',
    label: 'Tool-using agent',
    description: 'One agent plans and invokes bounded tools to complete a focused task.',
    route: ['Plan', 'Select tool', 'Act', 'Verify'],
    scores: { autonomy: 72, traceability: 83, coordination: 55 },
  },
  {
    id: 'multi-agent',
    label: 'Agent team',
    description: 'A coordinator delegates specialist work and synthesizes the result.',
    route: ['Coordinate', 'Delegate', 'Review', 'Synthesize'],
    scores: { autonomy: 88, traceability: 65, coordination: 96 },
  },
]

export const MODEL_PROFILES = [
  {
    id: 'fast',
    label: 'Fast interaction',
    model: 'Small / low-latency model',
    signal: 'Best when responsiveness and high request volume dominate.',
    scores: { quality: 72, latency: 94, cost: 91 },
  },
  {
    id: 'balanced',
    label: 'Product default',
    model: 'Balanced general model',
    signal: 'A pragmatic starting point for many grounded application flows.',
    scores: { quality: 87, latency: 78, cost: 73 },
  },
  {
    id: 'deep',
    label: 'Complex reasoning',
    model: 'High-capability reasoning model',
    signal: 'Reserve for difficult decisions where additional latency is justified.',
    scores: { quality: 96, latency: 48, cost: 41 },
  },
]

export const EVALUATORS = [
  { id: 'groundedness', label: 'Groundedness', description: 'Does the answer stay supported by supplied context?' },
  { id: 'task', label: 'Task success', description: 'Did the application complete the user’s intended job?' },
  { id: 'safety', label: 'Safety', description: 'Does the output respect policy and application boundaries?' },
  { id: 'latency', label: 'Latency', description: 'Does the full experience remain responsive enough?' },
]

export const FAQ = [
  {
    question: 'Is this only for Microsoft developers?',
    answer: 'No. Microsoft Foundry provides the design inspiration, while the learning experience is framed for the wider agent builder community and transferable tooling patterns.',
  },
  {
    question: 'Do I need confirmed session choices to register?',
    answer: 'No. Registering now records your interest. You can update the same registration when the programme is announced.',
  },
  {
    question: 'Will the sessions be hands-on?',
    answer: 'The final delivery format will be confirmed with the programme. Expect practical, application-first examples rather than product-only presentations.',
  },
  {
    question: 'Why sign in with GitHub?',
    answer: 'GitHub authentication gives each attendee a verified, stable identity and lets repeat submissions update one registration instead of creating duplicates.',
  },
]

export const REGISTRATION = {
  choices: [
    { id: 'local', label: 'Local development environment' },
    { id: 'cloud', label: 'Cloud development environment' },
  ],
  consent: 'I agree that my registration details may be used to administer this bootcamp and its six sessions.',
}
