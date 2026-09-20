# Roadmap

Identity freeze, bootstrap, model plane, then operator-install of the sidecar
and a human-gated production site. Later renames are human-gated. No calendar
estimates.

Frozen identity: [`WORKING_BRIEF.md`](WORKING_BRIEF.md). Lane map:
[`docs/TASK_MAP.md`](docs/TASK_MAP.md). Agent loop:
[ADR 0006](docs/adr/0006-agent-os-no-automerge.md).

## Ship

### M0 — identity freeze

**Done.** Product is Junction. CLI `junction`. Tagline and promise frozen.
ADR [0001](docs/adr/0001-product-identity.md). Envelope and execution id in
[`WORKING_BRIEF.md`](WORKING_BRIEF.md).

### M1 — bootstrap PR

**Merged** as [#23](https://github.com/laqaer/acpcrew/pull/23). Contributor
docs, `site/` overlay, CLI chrome, model-router health, Vercel hobby preview.

### M1.5 — model plane catalog + role DAG

**Merged** as [#24](https://github.com/laqaer/acpcrew/pull/24). Namespaced
catalog, role DAG, Settings pins. Unpinned roles stay `"auto"`.

### M1.6 — ship program (this cut)

**Open** as [#26](https://github.com/laqaer/acpcrew/pull/26) on
`cursor/junction-ship-program-55da`. Do not merge in agent executions.

- Advertised-model lookup actually calls ACP `available_models`.
- `set_model` skips namespaced sidecar slugs until M2.
- Economy roles fall back to the cheapest advertised id, not a flagship.
- User-facing chrome (dashboard title, Electron splash, channel `/help`,
  cold-start HTML) says Junction.
- Marketing site copy matches what the gateway does today.
- Ship + maintain roadmaps and the agent-OS loop (no auto-merge).

### M2 — operator-install of the model plane

Operator installs the published Codex Router sidecar. Junction keeps
observing it. Optional `openai_base_url` at the sidecar for agents that
speak that wire. Namespaced catalog slugs become live wire ids. Secrets
stay in the router's own entry path; Junction does not paste keys into chat.
Issue [#22](https://github.com/laqaer/acpcrew/issues/22).

### M3 — production marketing site

Human-gated spend and DNS. Quoted candidates (not purchased):

| Domain | 1-year list | Renewal |
|---|---|---|
| `getjunction.dev` | $9.99 | $13 |
| `withjunction.dev` | $9.99 | $13 |
| `tryjunction.dev` | $9.99 | $13 |
| `junction.software` | $29.99 | $32 |
| `junction.computer` | $33.99 | $32 |

`junction.dev` / `.app` / `.ai` / `.so` / `.run` and `usejunction.com` are
taken. Preview remains [junction-site.vercel.app](https://junction-site.vercel.app)
until an operator confirms a quote, pays, and attaches DNS. Agents must not
buy or change DNS.

### M4 — human-gated identity leftovers

Each is a dedicated change, not an opportunistic string sweep:

- Catalog-wide dashboard i18n (`{{productName}}` already binds new copy).
- Package and data-home rename (`kiro_crew`, `KIROCREW_HOME`, `~/.kiro/crew`,
  Electron `productName`).
- GitHub slug rename (`laqaer/acpcrew` until a human does it).

### M5 — publish

PyPI / Docker / GitHub Releases. Human-gated. `CHANGELOG.md` is written only
at a version bump.

## Maintain

No calendar cadence in this file — the loop is event-shaped.

1. **Scout.** An agent (or Dependabot) finds a defect, a stale catalog slug,
   a brand leftover, or a CI flake. It files a GitHub issue. It does not
   open a PR from the scout run unless the issue is already labeled
   `agent-os/ready`.
2. **Implement.** A second agent picks `agent-os/ready` issues, works on a
   `cursor/*` branch, opens a draft PR, and waits.
3. **Review.** A third agent reviews the PR (tests, keystone, harness-parity,
   identity). It may request changes or label `agent-os/approved`.
4. **Merge.** A human merges. Agents never merge, never auto-approve their
   own PRs, and never push to `main`.
5. **Adversarial pass.** After a model-plane or identity cut, run a
   read-only review agent that is rewarded for finding bugs, not for
   agreeing. File what it finds; do not let it edit in the same turn.
6. **Catalog refresh.** When Codex Router's registry changes, update
   `model_router/catalog.json` as a snapshot — slugs and labels only.
7. **Security floor.** Keystone, governance, `CONTRACT_VERSION` 1, computer
   use in-band, positive harness identity. An upstream sync must not weaken
   them or restore Channels / Board.
8. **CI.** Keep the existing gates. A flake is a bug, not a rerun.

Cursor Automations that spawn those three roles are created in the Cursor
dashboard (this repo cannot register them from a PR). The handoff contract
is [ADR 0006](docs/adr/0006-agent-os-no-automerge.md).

## What else

Worth doing, not on the bootstrap PR:

- Confirm a domain from the M3 table and attach it to `junction-site`
  ([#27](https://github.com/laqaer/acpcrew/issues/27)).
- Install the Codex Router sidecar on a real machine and prove M2
  ([#22](https://github.com/laqaer/acpcrew/issues/22)).
- Remaining dashboard catalog literals (`en.json` / locale values) in
  reviewable chunks ([#28](https://github.com/laqaer/acpcrew/issues/28)).
- Packaged user docs under `src/kiro_crew/docs/` still say the old CLI in
  places; rewrite as a docs PR, not a silent sweep.
- Create Cursor Automations for scout / implementer / reviewer, and mint
  the `agent-os/*` labels once ([#29](https://github.com/laqaer/acpcrew/issues/29)).
- Adversarial leftovers: orchestration apply site, brand-gate teaching text
  ([#30](https://github.com/laqaer/acpcrew/issues/30)).
- PyPI name reservation for `junction` when publish is real.
- A short demo recording on the marketing site once M2 is true.
- Do not present Junction as a public fork. Do not vendor Codex Router.
