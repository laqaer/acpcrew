# Junction

**Where coding agents meet the models you want.**

Junction is a local control plane. It docks ACP coding agents and routes
their inference, with memory and cron, on hardware you control. `kiro-cli`
is optional.

Run Cursor, Claude, Codex, Grok from one local dashboard — and route their
inference to Kimi, DeepSeek, Copilot, and the rest — with memory and cron,
without requiring `kiro-cli`.

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
   agent. `kiro-cli` remains selectable and last in that preference list.
2. **Model plane** — an optional Codex Router sidecar on loopback. Junction
   observes it (`src/kiro_crew/model_router/`). Agents may later point
   `openai_base_url` at it. If the sidecar is down, the ACP gateway still
   runs.

Memory, cron, skills, and the dashboard come from the gateway that already
lives in this tree.

## What it is not

- **Not another chatbot.** There is no hosted conversation product and no
  account system of Junction's own.
- **Not a Codex clone.** Codex is one dockable ACP agent, not the product.
- **Not Kiro Crew.** Kiro Crew is the Apache-2.0 upstream this checkout
  forks. Junction is the product name of this fork.
- **Not Codex Router.** Codex Router is the MIT model-plane sidecar Junction
  observes. It is a separate project; this checkout does not vendor it.

Rejected names (Hearth, Relay, Rudder, and the rest) live in
[`docs/adr/0001-product-identity.md`](docs/adr/0001-product-identity.md).

## CLI

| Command | Role |
|---|---|
| `junction` | Primary CLI. |
| `acpcrew` | Alias of the same entry point. |
| `kirocrew` | Alias of the same entry point (upstream spelling). |

```json
{
  "agent": {
    "provider": "acp",
    "acp_backend": "auto"
  }
}
```

## Identifiers that stay

Until a dedicated, human-gated rename, these stay as upstream spelled them:

| Identifier | Value |
|---|---|
| Python package | `kiro_crew` |
| Data-home env | `KIROCREW_HOME` |
| Default data home | `~/.kiro/crew` |
| Electron `productName` | unchanged |
| GitHub slug | `laqaer/acpcrew` |
| PyPI name | `kirocrew` |

The brand gate still forbids concatenated `KiroCrew` in **new prose**.
Junction is the product. "Kiro Crew" (two words) is the upstream project's
name.

## Authority and lineage

Frozen identity and the execution envelope:
[`WORKING_BRIEF.md`](WORKING_BRIEF.md). Agent overlay:
[`JUNCTION.md`](JUNCTION.md). Multi-ACP facts:
[`FORK.md`](FORK.md). Provenance:
[`docs/provenance/README.md`](docs/provenance/README.md).
