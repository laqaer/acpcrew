# acpcrew

Private fork of [kirodotdev/KiroCrew](https://github.com/kirodotdev/KiroCrew)
(Apache-2.0). Upstream at fork: `b727113cc` (`upstream/main`).

## Why this exists

Kiro Crew is a local agent gateway (dashboard, CLI, messaging channels, cron,
memory) that speaks [Agent Client Protocol](https://agentclientprotocol.com/)
over stdio. Upstream hard-requires `kiro-cli`. This fork does not.

Default `agent.acp_backend` is `auto`: the first installed of Cursor, Claude,
Codex, Kimi, DeepSeek Harness, Goose, Grok, Pi, Droid. Set a concrete id to pin.

```json
{
  "agent": {
    "provider": "acp",
    "acp_backend": "cursor"
  }
}
```

CLI: `acpcrew` is an alias of `kirocrew`. State still lives under `~/.kiro/crew`
until a later rebrand.

Design: `docs/plans/2026-08-25-acpcrew-design.md`.
