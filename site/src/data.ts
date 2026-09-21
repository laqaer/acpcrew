export const SITE_URL = 'https://getjunction.dev';
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
      'Dock Cursor, Claude, Codex, Grok, and others from one registry. The default backend is auto. A vendor agent CLI is optional — install one only when you want that harness.',
  },
  {
    label: 'Model plane',
    sub: 'Sidecar, optional',
    detail:
      'An optional sidecar routes inference. Junction ships that sidecar’s namespaced model catalog and a role DAG (orchestration, planning, execution) that spends tokens where they return the most work. Advertised harness ids apply now; catalog slugs apply once the sidecar is installed. Never paste provider keys into chat. If the sidecar is absent, the gateway still runs.',
  },
];

export const ARCH = [
  { label: 'CLI / Dashboard', sub: 'junction · loopback' },
  { label: 'Gateway', sub: 'Python control plane' },
  { label: 'Harness plane', sub: 'ACP agents' },
  { label: 'Model plane', sub: 'Sidecar, optional' },
  { label: 'Memory & Cron', sub: 'Local, durable' },
];

export const TERMINAL_LINES = [
  { prompt: true, text: 'junction setup' },
  { text: 'First-run complete. Dashboard unlocks on this machine.' },
  { prompt: true, text: 'junction planes' },
  { text: 'Junction planes' },
  { text: '   harness:     ', hl: 'auto' },
  { text: '   model:       ', hl: 'sidecar optional' },
  { prompt: true, text: 'junction up' },
  { text: 'Dashboard:      ', hl: 'loopback' },
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
    user: 'spend cheap tokens on orchestration and save the capable model for planning',
    bot: 'Orchestration is economy, planning is capable, execution is standard. Advertised harness ids apply on the live session. Catalog slugs wait for the optional sidecar. If the sidecar is down, this gateway still runs.',
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
    a: 'Junction runs locally. The dashboard binds to loopback. Voice transcription uses local Whisper. Inference goes to the models you configure — a provider you already use, or the optional model-plane sidecar on loopback.',
  },
  {
    q: 'How does model routing work?',
    a: 'The model plane is an optional sidecar (Responses API on loopback). Junction observes it; it does not vendor that Node app. Role routing applies advertised harness ids now. Namespaced catalog slugs land when you install the sidecar. Never paste provider keys into chat. If the sidecar is absent, the gateway still works as an ACP control plane.',
  },
  {
    q: 'What models can I use?',
    a: 'Junction ships the namespaced catalog the model-plane sidecar knows: Kimi, DeepSeek, Grok, Anthropic, Ollama Cloud, ClinePass, Copilot, OpenRouter, and the rest. Live-catalog providers are curated on the sidecar. The default pin is auto. Role routing (orchestration, planning, execution) picks by cost class so cheap models handle coordination and capable models handle planning.',
  },
  {
    q: 'Do I need a vendor agent CLI?',
    a: 'No. Dock whichever ACP runtime you already use. A vendor agent CLI is optional — the harness plane picks a usable runtime automatically.',
  },
  {
    q: 'How do I add custom tools?',
    a: 'Open the dashboard MCP tab, or drop a server config in the gateway’s local config directory. It is auto-discovered and synced.',
  },
  {
    q: 'How do I contribute?',
    a: 'Clone github.com/laqaer/acpcrew, create a branch, and open a PR. See CONTRIBUTING.md.',
  },
  {
    q: 'Where is the website hosted?',
    a: 'The marketing site is live at https://getjunction.dev. That is Junction’s public canonical site.',
  },
];
