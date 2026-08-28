# acpcrew — design (2026-08-25)

Fork of [kirodotdev/KiroCrew](https://github.com/kirodotdev/KiroCrew) (Apache-2.0).
Upstream is a local gateway (dashboard, CLI, Slack/Discord/Telegram, cron, memory)
that drives **one** ACP agent: `kiro-cli`. This fork keeps the gateway and makes
the ACP runtime pluggable.

## Problem

KiroCrew already speaks Agent Client Protocol (JSON-RPC 2.0 over stdio). The
lock-in is spawn + handshake:

- empty `agent.acp_backend` always means `kiro-cli acp --agent <name>`
- protocol version is kiro's date stamp unless the dormant Claude seam is used
- unknown backends silently degrade to kiro-cli

Our stack already runs ACP agents through Buzz: Cursor (`cursor-agent acp`),
Claude (`claude-agent-acp`), Codex (`@agentclientprotocol/codex-acp`), DeepSeek
Harness (`~/.buzz/tools/dsh-buzz/launch-acp.sh`), Kimi (`kimi acp`), Goose,
Grok, Droid, and Pi (`pi-acp`). We do not want kiro-cli as a hard requirement.

## Decision

Keep the KiroCrew process (Python gateway + dashboard). Replace the kiro-only
spawn default with a **runtime registry**.

| Config `agent.acp_backend` | Effect |
|---|---|
| `auto` (default) | First installed of: cursor, claude, codex, kimi, dsh, goose, grok, pi, droid. kiro-cli only if nothing else is present. |
| `cursor` / `claude` / `codex` / `dsh` / `pi` / `kimi` / `goose` / `grok` / `droid` | That ACP stdio server. ACP protocolVersion `1`. One process per session (`AcpClient`). |
| `kiro` or `""` | Upstream kiro-cli path (`AcpRuntime` multiplex). Optional. |
| `kas` | Upstream kiro-agent. Optional. |

Unknown values degrade to `auto`, not kiro-cli.

## Non-goals (this cut)

- Full rebrand of the Python package (`kiro_crew`) or `~/.kiro/crew` paths
- Teaching spec-family agents kiro-only extensions (`_session/steer`, session sharing)
- Wiring Buzz Nostr identity into the gateway
- Pi's native `--mode rpc` (we spawn `pi-acp`, which is ACP)

## CLI

`acpcrew` is an alias of the existing `kirocrew` entry point.
