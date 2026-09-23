export const SITE_URL = 'https://getjunction.dev';
export const GITHUB_URL = 'https://github.com/myrmitis/junction';

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
    sub: 'Built-in catalog',
    detail:
      'junction up starts a loopback catalog: namespaced model choices and a role DAG (orchestration, planning, execution). Your docked agent uses the models it already serves. Junction does not forward provider traffic. Never paste provider keys into chat. If the catalog is down, the gateway still runs.',
  },
];

export const ARCH = [
  { label: 'CLI / Dashboard', sub: 'junction · loopback' },
  { label: 'Gateway', sub: 'Python control plane' },
  { label: 'Harness plane', sub: 'ACP agents' },
  { label: 'Model plane', sub: 'Built-in catalog' },
  { label: 'Memory & Cron', sub: 'Local, durable' },
];

export const TERMINAL_LINES = [
  { prompt: true, text: 'junction setup' },
  { text: 'First-run complete. Dashboard unlocks on this machine.' },
  { prompt: true, text: 'junction planes' },
  { text: 'Junction planes' },
  { text: '   harness:     ', hl: 'auto' },
  { text: '   model:       ', hl: 'built-in catalog' },
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
    bot: 'Orchestration is economy, planning is capable, execution is standard. The docked agent uses models it already serves. The catalog lists the wider set; Junction does not forward that traffic. If the catalog is down, this gateway still runs.',
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
    a: 'A CLI is one harness talking to one vendor model. Junction docks several ACP agents on one loopback dashboard, and a role DAG says which cost class should do orchestration, planning, and execution. Memory and cron stay on your machine. The agent still talks to the models it already serves.',
  },
  {
    q: 'Does any data leave my machine?',
    a: 'The dashboard binds to loopback. Chat, files, and provider keys stay on this machine. Inference goes only to the models you configure. Junction can also send one anonymous daily heartbeat: a random install id, the release, the Python minor version, the install channel, and a first-run flag. Prompts, paths, and credentials are not in it. Turn it off with junction telemetry disable.',
  },
  {
    q: 'How does model routing work?',
    a: 'Cheap models coordinate, a capable model plans, and everyday coding sits in between. That plan is junction router plan. The live session uses models the docked agent already advertises. The catalog is the map of other choices. Junction does not forward provider traffic. Never paste provider keys into chat.',
  },
  {
    q: 'What models can I use?',
    a: 'The docked agent serves its own models, and the default pin is auto. junction router catalog also lists a namespaced snapshot: Kimi, DeepSeek, Grok, Anthropic, Ollama Cloud, ClinePass, Copilot, OpenRouter, and the rest. Those slugs are labels. Junction does not forward completions to them. Role routing picks a cost class so cheap models coordinate and capable models plan.',
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
    a: 'Clone github.com/myrmitis/junction, create a branch, and open a PR. See CONTRIBUTING.md.',
  },
  {
    q: 'Does Junction forward provider traffic?',
    a: 'No. junction up serves a loopback catalog and a role DAG. Your docked agent talks to the models it already serves. Completion routes on the catalog answer 501. Never paste provider keys into chat. If the catalog listener is down, the gateway still runs.',
  },
];
