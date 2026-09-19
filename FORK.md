# Junction

Apache-2.0 fork of [Kiro Crew](https://github.com/kirodotdev/KiroCrew).
GitHub slug: `laqaer/acpcrew`. Product identity:
[`PRODUCT.md`](PRODUCT.md). Overlay: [`JUNCTION.md`](JUNCTION.md).

Upstream at fork time included a kiro-cli-only ACP spawn path. This tree
does not require `kiro-cli`. Multi-ACP is already on `main`.

## Why this exists

Junction is a local control plane (dashboard, CLI, messaging channels,
cron, memory) that speaks
[Agent Client Protocol](https://agentclientprotocol.com/) over stdio and
optionally routes inference through a Codex Router sidecar. It is not
Kiro Crew as a product and not Codex Router as a product.

Default `agent.acp_backend` is `auto`: the first installed of Cursor,
Claude, Codex, Kimi, DeepSeek Harness, Goose, Grok, Pi, Droid. `kiro-cli`
is last in that list and optional. Set a concrete id to pin.

```json
{
  "agent": {
    "provider": "acp",
    "acp_backend": "cursor"
  }
}
```

CLI: `junction` is primary. `acpcrew` and `kirocrew` remain aliases.
State still lives under `~/.kiro/crew` until a later, human-gated
rebrand. Package identifiers stay `kiro_crew` / `KIROCREW_HOME`.

Registry: `src/kiro_crew/acp/runtimes.py`. Design notes:
`docs/plans/2026-08-25-acpcrew-design.md`. Two-plane thesis:
[`ARCHITECTURE.md`](ARCHITECTURE.md).
