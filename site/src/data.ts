export const FEATURES = [
  {
    icon: '01',
    title: 'One dashboard, many agents',
    desc: 'Run Cursor, Claude, Codex, and Grok from one local dashboard. Same sessions from the CLI, Slack, or the web UI.',
    tag: 'Core',
  },
  {
    icon: '02',
    title: 'Model routing',
    desc: 'Route inference across Kimi, DeepSeek, Copilot, and the rest. Orchestration, planning, and execution can each use a different cost class so tokens buy the most work.',
    tag: 'AI',
  },
  {
    icon: '03',
    title: 'Cron & Heartbeat',
    desc: 'Recurring jobs, one-shot timers, skip-dates, and a self-healing heartbeat that survives gateway restarts.',
    tag: 'Ops',
  },
  {
    icon: '04',
    title: 'Persistent Memory',
    desc: 'Episodic, semantic, and vector memory. Learns corrections, tracks projects, decays history over 90 days.',
    tag: 'AI',
  },
  {
    icon: '05',
    title: 'Parallel Subagents',
    desc: 'Fan-out independent tasks to parallel agents. Results inject as completion events.',
    tag: 'Core',
  },
  {
    icon: '06',
    title: 'Autonomous Task Runner',
    desc: 'Give it a spec, walk away. Git-isolated execution, checkpoint resume, retry and replan, learn from failures.',
    tag: 'AI',
  },
  {
    icon: '07',
    title: 'MCP Tools',
    desc: 'GitHub, CI/CD, issue trackers, calendars, email — wired through Model Context Protocol.',
    tag: 'Ops',
  },
  {
    icon: '08',
    title: 'Slack & Dashboard',
    desc: 'Same agent, same context. Voice memos via local Whisper. Images to vision. Presigned dashboard links.',
    tag: 'Core',
  },
  {
    icon: '09',
    title: 'Trust & Security',
    desc: 'Four-tier approval. Tamper-resistant deny patterns. HMAC audit trail. Sandbox mode.',
    tag: 'Ops',
  },
];

export const TAG_CLS: Record<string, string> = {
  Core: 'bg-indigo-500/10 text-indigo-400',
  AI: 'bg-amber-300/10 text-amber-300',
  Ops: 'bg-green-500/10 text-green-400',
  UX: 'bg-rose-500/10 text-rose-400',
};

export const ARCH_PLANES = [
  {
    label: 'Harness plane',
    sub: 'ACP agents',
    detail:
      'Dock Cursor, Claude, Codex, Grok, and others from one registry. The default backend is auto. kiro-cli is optional — install it only when you want that harness.',
  },
  {
    label: 'Model plane',
    sub: 'Sidecar, optional',
    detail:
      'An optional Codex Router sidecar routes inference. Junction ships that sidecar’s namespaced model catalog and a role DAG (orchestration, planning, execution) that spends tokens where they return the most work. Never paste provider keys into chat. If the sidecar is absent, the gateway still runs.',
  },
];

export const ARCH = [
  { label: 'CLI / Dashboard', sub: 'junction · localhost:5476' },
  { label: 'Gateway', sub: 'Python control plane' },
  { label: 'Harness plane', sub: 'ACP agents' },
  { label: 'Model plane', sub: 'Sidecar, optional' },
  { label: 'Memory & Cron', sub: 'Local, durable' },
];

export const TERMINAL_LINES = [
  { prompt: true, text: 'junction gateway' },
  { text: 'Junction starting...' },
  { text: '   Dashboard:   ', hl: 'http://localhost:5476' },
  { text: '   Harness:     ', hl: 'ACP runtimes (auto)' },
  { text: '   Model plane: ', hl: 'sidecar optional' },
  { text: '   Memory:      ', hl: 'vector + episodic + semantic' },
  { text: '   Cron:        ', hl: '3 jobs scheduled' },
  { comment: '   Ready. Open http://localhost:5476' },
];

export const IN_ACTION = [
  {
    label: 'Agents',
    user: 'open a Claude session and a Codex session side by side',
    bot: 'Two sessions on the harness plane. Claude and Codex are docked. Switch tabs any time — memory stays with each thread.',
  },
  {
    label: 'Route',
    user: 'point this session at the model plane',
    bot: 'openai_base_url now targets the local sidecar. Provider keys stay in the sidecar — never paste them into chat. If the sidecar is down, this gateway still runs.',
  },
  {
    label: 'Cron',
    user: 'every weekday at 9am give me a pipeline briefing',
    bot: "Created cron job. I'll check your pipelines every weekday at 9:00 AM and send you the results.",
  },
  {
    label: 'Learn',
    user: 'no, always use the staging profile for deploy credentials',
    bot: "Learned: Use the staging profile for deploy credentials. I won't make this mistake again.",
  },
  {
    label: 'Voice',
    user: '[sends a voice memo in Slack]',
    bot: 'Transcribed: "Can you check if the deployment to prod finished?"\nChecking your pipeline now — Deployment d-4829 completed 12 minutes ago. All health checks passing.',
  },
];

export const FAQ = [
  {
    q: 'Does any data leave my machine?',
    a: 'Junction runs locally. The dashboard binds to localhost. Voice transcription uses local Whisper. Inference goes to the models you configure — a provider you already use, or the optional model-plane sidecar on loopback.',
  },
  {
    q: 'How does model routing work?',
    a: 'The model plane is an optional Codex Router sidecar (Responses API and LiteLLM). That sidecar is not this Python tree. Junction observes it; it does not vendor the Node app. Never paste provider keys into chat. If the sidecar is absent, the gateway still works as an ACP control plane.',
  },
  {
    q: 'What models can I use?',
    a: 'Junction ships the full namespaced catalog the model-plane sidecar knows: Kimi, DeepSeek, Grok, Anthropic, Ollama Cloud, ClinePass, Copilot, OpenRouter, and the rest. Live-catalog providers are curated on the sidecar. The default pin is auto. Role routing (orchestration, planning, execution) picks by cost class so cheap models handle coordination and capable models handle planning.',
  },
  {
    q: 'Is kiro-cli required?',
    a: 'No. kiro-cli is optional. Dock it when you want that harness. The harness plane picks a usable ACP runtime automatically.',
  },
  {
    q: 'How do I add custom tools?',
    a: 'Drop an MCP server config in ~/.kiro/crew/mcp.json. It is auto-discovered and synced. Or install via the dashboard MCP tab.',
  },
  {
    q: 'How do I contribute?',
    a: 'Clone the repo at github.com/laqaer/acpcrew, create a branch, and open a PR. See CONTRIBUTING.md.',
  },
];

export const THEMES = [
  '#22c55e', '#f59e0b', '#6366f1', '#f43f5e', '#06b6d4',
  '#a78bfa', '#88c0d0', '#e0af68', '#eb6f92', '#fab387',
  '#d4be98', '#f9e2af', '#93a1a1', '#7dcfff',
];
