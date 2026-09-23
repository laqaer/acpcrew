# Junction

**Where coding agents meet the models you want.**

Junction is a local control plane. It docks ACP coding agents and routes
their inference, with memory and cron, on hardware you control. A vendor
agent CLI is optional.

Run Cursor, Claude, Codex, Grok from one local dashboard — and route their
inference to Kimi, DeepSeek, Copilot, and the rest — with memory and cron.
A vendor agent CLI is optional.

Voice: local-first, precise, no hype.

## Who it is for

Operators who already run coding agents and want one place to choose **which
agent** and **which model**, without moving work into a hosted chatbot or
giving a remote service the keys.

Typical operator: a developer or small team with Cursor, Claude Code, Codex,
or Grok on the machine, plus a mix of provider accounts (Kimi, DeepSeek,
Copilot, …). Junction is the join.

## What it is

Two planes, one product. See [`ARCHITECTURE.md`](ARCHITECTURE.md).

1. **Harness plane** — an ACP runtime registry. Default `agent.acp_backend`
   is `auto`: the first installed of Cursor, Claude, Codex, Kimi, DeepSeek
   Harness, Goose, Grok, Pi, Droid. Pin a concrete id when you want one
   agent. A vendor agent CLI remains selectable and last in that preference list.
2. **Model plane** — an optional Codex Router sidecar on loopback. Junction
   observes it (`src/junction/model_router/`). The shipped catalog lists
   every namespaced model choice the sidecar advertises. Role routing
   (orchestration → planning → execution) spends cheaper models on
   coordination and capable models on planning. If the sidecar is down, the
   ACP gateway still runs.

Memory, cron, skills, and the dashboard come from the gateway that already
lives in this tree.

## What it is not

- **Not another chatbot.** There is no hosted conversation product and no
  account system of Junction's own.
- **Not a Codex clone.** Codex is one dockable ACP agent, not the product.
- **Not Codex Router.** Codex Router is the MIT model-plane sidecar Junction
  observes. It is a separate project; this checkout does not vendor it.

Rejected names (Hearth, Relay, Rudder, and the rest) live in
[`docs/adr/0001-product-identity.md`](docs/adr/0001-product-identity.md).

## CLI

| Command | Role |
|---|---|
| `junction` | Primary CLI. |
| `junction up` | Compose both planes, then start the loopback dashboard. |
| `junction planes` | Harness + model + role DAG in one snapshot (`--json` for machines). |
| `junction doctor --quick` | Compose-only probe. Full `junction doctor` still exists. |
| `junction gateway` | Same server as `up`; kept for scripts. |
| `junction router catalog` | Namespaced model choices (no credentials). |
| `junction router plan` | Orchestration / planning / execution DAG. |

```json
{
  "agent": {
    "provider": "acp",
    "acp_backend": "auto"
  }
}
```

## Implementation identifiers

Python import path, data-home env, and default data directory keep the
spellings the runtime already uses (`junction`, `JUNCTION_HOME`,
`~/.kiro/crew`) until a dedicated, human-gated rename. They are not the
product name. GitHub slug: `laqaer/junction`. Site: https://getjunction.dev

The brand gate still forbids concatenated `Junction` in **new prose**.
Junction is the product.

## Authority

Frozen identity and the execution envelope:
[`WORKING_BRIEF.md`](WORKING_BRIEF.md). Agent overlay:
[`JUNCTION.md`](JUNCTION.md). Multi-ACP facts:
[`TREE.md`](TREE.md). Provenance:
[`docs/provenance/README.md`](docs/provenance/README.md).
