export const SITE_URL = 'https://junction.computer';
export const GITHUB_URL = 'https://github.com/laqaer/acpcrew';

export const ROLE_DAG = [
  {
    role: 'Orchestration',
    class: 'economy',
    detail: 'Cheap models coordinate. Many tokens, little need for a flagship.',
  },
  {
    role: 'Planning',
    class: 'capable',
    detail: 'Rare, high-leverage decomposition. Spend where the plan is the product.',
  },
  {
    role: 'Execution',
    class: 'standard',
    detail: 'Bulk of coding tokens. Capable enough, not the most expensive seat.',
  },
];

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
  { prompt: true, text: 'junction planes' },
  { text: 'Junction planes' },
  { text: '   harness:     ', hl: 'auto (kiro-cli optional)' },
  { text: '   model:       ', hl: 'sidecar optional' },
  { prompt: true, text: 'junction gateway' },
  { text: 'Dashboard:      ', hl: 'http://localhost:5476' },
  { comment: '   Ready. Two planes, one local install.' },
];

export const IN_ACTION = [
  {
    label: 'Dock',
    user: 'open a Claude session and a Codex session side by side',
    bot: 'Two sessions on the harness plane. Claude and Codex are docked. Switch tabs any time — memory stays with each thread.',
  },
  {
    label: 'Route',
    user: 'point this session at the model plane',
    bot: 'openai_base_url now targets the local sidecar. Provider keys stay in the sidecar — never paste them into chat. If the sidecar is down, this gateway still runs.',
  },
  {
    label: 'Spend',
    user: 'use an economy model for orchestration and a capable one for planning',
    bot: 'junction router plan — orchestration on economy, planning on capable, execution on standard. Pins in agent.role_models still win.',
  },
];

export const FAQ = [
  {
    q: 'Why not just run an agent CLI?',
    a: 'A CLI is one harness talking to one vendor model. Junction is the local switch: dock several ACP agents, then route their inference through a role DAG so orchestration stays cheap and planning stays capable. Memory, cron, and the dashboard stay on your machine.',
  },
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
