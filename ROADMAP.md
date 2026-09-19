# Roadmap

Identity freeze, this bootstrap cut, then operator-install of the model
plane. Later renames are human-gated. No calendar estimates.

Frozen identity: [`WORKING_BRIEF.md`](WORKING_BRIEF.md). Lane map:
[`docs/TASK_MAP.md`](docs/TASK_MAP.md).

## M0 — identity freeze

**Done.** Product is Junction. CLI `junction`. Tagline and promise frozen.
ADR [0001](docs/adr/0001-product-identity.md). Envelope and execution id in
[`WORKING_BRIEF.md`](WORKING_BRIEF.md).

## M1 — bootstrap PR (this cut)

**In progress** on `cursor/junction-bootstrap-55da`. One PR to `main`. Do
not merge it in this execution.

- Contributor docs and agent OS (product, architecture, ADRs 0002–0005,
  provenance, overlay skills).
- Marketing `site/` overlay (Junction / track motif; keep the amber; drop
  the ghost emoji).
- CLI chrome: primary `junction`, aliases `acpcrew` / `kirocrew`.
- `src/kiro_crew/model_router/` health and status (observe + compose; no
  vendoring).
- GitHub issues for the epic and lanes.
- Site CI and a Vercel **preview** of `site/` only (hobby, no spend).

Non-goals for M1: merge; GitHub rename; package / data-home rename; PyPI /
Docker / DNS / paid Vercel; vendoring Codex Router; copying tray / widget /
Electron / public Cursor HTTPS tunnel / ACP agent bridges; reimplementing
LiteLLM; whole-tree i18n rewrite; `CHANGELOG.md`.

## M2 — operator-install of the model plane

Operator installs the published Codex Router sidecar. Junction keeps
observing it. Optional `openai_base_url` at the sidecar for agents that
speak that wire. Secrets stay in the router's own entry path; Junction
does not paste keys into chat.

## Later — human-gated

These do not ride the bootstrap PR:

- Catalog-wide dashboard i18n rewrite (`{{productName}}` already binds new
  copy; the remaining literals are a follow-up).
- Package and data-home rename (`kiro_crew`, `KIROCREW_HOME`,
  `~/.kiro/crew`, Electron `productName`).
- GitHub slug rename (`laqaer/acpcrew` until a human does it).

Each is a dedicated change with its own review, not an opportunistic
string sweep.
