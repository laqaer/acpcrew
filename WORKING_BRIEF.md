# Working brief — Junction bootstrap

This is the frozen execution contract for the Junction bootstrap cut.
Product identity, the two-plane thesis, the authority envelope, and the
execution id live here. Architecture detail lives in later ADRs and in
root `ARCHITECTURE.md` once the agent OS lane lands them.

## Identity (frozen)

| Field | Value |
|---|---|
| Product | **Junction** |
| CLI | `junction` (primary). `acpcrew` and `kirocrew` remain aliases. |
| Tagline | Where coding agents meet the models you want. |
| Promise | Run Cursor, Claude, Codex, Grok from one local dashboard — and route their inference to Kimi, DeepSeek, Copilot, and the rest — with memory and cron, without requiring `kiro-cli`. |
| Voice | Local-first, precise, no hype. Not another chatbot. Not a Codex clone. |
| Visual | Keep the amber already in `site/`. Drop the ghost emoji. Junction / track motif. No emoji icons. |
| GitHub slug | `laqaer/acpcrew` until a human renames it. |
| Package / data home | `kiro_crew`, `KIROCREW_HOME`, Electron `productName` stay as upstream spelled them. |
| Lineage | Apache-2.0 [Kiro Crew](https://github.com/kirodotdev/KiroCrew) fork + MIT-observed [Codex Router](https://github.com/duolahypercho/codex-router) model plane. Junction is the product. |

Decision record: [`docs/adr/0001-product-identity.md`](docs/adr/0001-product-identity.md).
Agent overlay: [`JUNCTION.md`](JUNCTION.md).

## Two-plane thesis

Junction is a **local control plane** that docks ACP agents and routes their
models. Combining this fork with Codex Router is two planes in one product,
not a Node dump into Python.

```
Operator
  → junction CLI / dashboard
    → Python gateway
      → Harness plane (ACP runtime registry: Cursor, Claude, Codex, Grok, Pi, …)
      → Model plane (optional Codex Router sidecar on loopback, typically :4202 + LiteLLM :4200)
      → Memory, cron, skills
```

- **Harness plane** already exists on `main`: `agent.acp_backend` defaults to
  `auto` via `src/kiro_crew/acp/runtimes.py`. Multi-ACP must not be re-landed.
- **Model plane** is observed and composed this cut: Python supervisor /
  health / status in `src/kiro_crew/model_router/`. The sidecar is the
  published Codex Router (or a later vendored subset). If the sidecar is
  absent, Junction still works as an ACP gateway (degraded, documented).
- Agents may optionally point `openai_base_url` at the model plane. Junction
  never pastes provider keys into chat.

## Authority envelope

Safe agent-prompts defaults for this execution:

| Allowed | Blocked |
|---|---|
| Feature branch, commit, push | Merge to `main` |
| Pull request | Production deploy (including GitHub Pages on `main`) |
| GitHub issues for the epic and lanes | DNS changes |
| Vercel **preview** of `site/` only, hobby, no spend | Paid Vercel, PyPI, Docker publish |
| | External comms (issues on other repos, emails, tweets) |
| | Data deletion, irreversible migrations |
| | GitHub repository rename |

## Execution

| Field | Value |
|---|---|
| Execution id | `bc-39bfeb15-ff12-4636-840a-217a97c555da` |
| Branch | `cursor/junction-bootstrap-55da` |
| Base | `main` at `78424fb73` |
| Intake | No acpcrew intake issue existed at start. Open Dependabot PRs #10–#14 are unrelated. |
| Shape | One bootstrap PR to `main`. Do not merge it in this execution. |

## This-cut non-goals

Merge; GitHub rename; package / data-home rename; PyPI / Docker / DNS / paid
Vercel; vendoring Codex Router; copying tray / widget / Electron / public
Cursor HTTPS tunnel / ACP agent bridges; reimplementing LiteLLM; storing
provider keys in `KIROCREW_HOME` without the router's secret-entry rules;
weakening keystone or harness-parity; restoring Channels / Board; whole-tree
i18n rewrite; Dependabot unless it blocks the branch; `CHANGELOG.md` (written
only at version bump).
