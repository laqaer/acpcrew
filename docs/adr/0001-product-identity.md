# ADR 0001 — Product identity is Junction

- Status: accepted
- Date: 2026-09-19
- Execution: `bc-39bfeb15-ff12-4636-840a-217a97c555da`

## Context

`laqaer/acpcrew` already docks multiple ACP agents on `main`. User-facing
chrome still said Kiro Crew / acpcrew in README, the marketing site, CLI
help, and the dashboard default bot name. The operator asked to leave both
names, combine Codex Router as a model plane, run a full branding assessment,
then decide. Junction is the product of this checkout, not a public fork
identity.

Criteria: one-word CLI; works for **both** “which agent” and “which model”;
local-first; not a clone of Crew / Router / Codex; searchable; low trademark
collision.

## Decision

The product name is **Junction**.

| Surface | Spelling |
|---|---|
| Prose / dashboard default | Junction |
| Primary CLI | `junction` |
| Product-facing aliases | none |
| Tagline | Where coding agents meet the models you want. |
| GitHub slug | `laqaer/acpcrew` (human rename later) |
| Python package / data home / Electron id | Unchanged this cut |

## Assessment (then the winner)

| Name | Fit | CLI | Collisions | Verdict |
|---|---|---|---|---|
| Hearth | Strong home/memory; weak routing | `hearth` | Hearthstone | Runner-up |
| Relay | Strong routing; weak workspace | `relay` | Many Relays | Reject |
| Rudder | Steer agents + models | `rudder` | RudderStack | Reject |
| Harbor / Quay / Dock | Dock agents | — | CNCF Harbor, quay.io, Docker | Reject |
| Helm / Tiller | Steer | — | Kubernetes | Reject |
| Loom / Warp / Lattice / Nexus | Metaphor | — | Loom, Cloudflare WARP, Lattice HQ, Sonatype | Reject |
| Compass / Pilot / Beacon / Atlas | Navigate | — | Atlassian, many pilots | Reject |
| Chartroom | Owner’s chartingstars.com | `chartroom` | None, but long/obscure | Internal nod only |
| Helix | Persistence | `helix` | Helix editor | Reject |
| Lantern | Local light | `lantern` | Few | Warm but silent on routing |
| Dockyard | Agent home | `dockyard` | Few | Mute on models |
| Portico | Gateway | `portico` | Few | Gateway ≠ two planes |
| Switchboard | Classic routing | `switchboard` | Dated, long | Reject |
| Codex Router | Accurate to one plane | — | Their 3.7k-star product | Never |
| acpcrew / Kiro Crew | Current | — | Operator asked to leave both | Never |
| **Junction** | Meeting of agent plane + model plane | `junction` | Minor (git-junction, road signs); no category killer | **Winner** |

Junction names the join: ACP harnesses on one side, model routing on the other.
Hearth was the runner-up (home/memory) and lost because it is silent on routing.

## Consequences

- User-facing overlay this cut: README, `site/`, CLI, dashboard
  `DEFAULT_PRODUCT_NAME` / `bot_name`, brand gate.
- Brand gate still forbids concatenated `KiroCrew` in newly added prose.
  Junction is accepted. Do not require a whole-tree rename of identifiers.
- Hardcoded catalog descriptions stay a follow-up issue.
- Chartroom remains an internal nod only, not a public name.

## Not decided here

Two-plane composition, sidecar vs vendor, security invariants, and preview vs
production are ADRs 0002–0005. Until those files exist, follow
[`../../WORKING_BRIEF.md`](../../WORKING_BRIEF.md).
