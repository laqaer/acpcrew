# Junction

Local control plane that docks ACP coding agents and routes their models.
GitHub slug: `myrmitis/junction`. Product identity:
[`PRODUCT.md`](PRODUCT.md). Overlay: [`JUNCTION.md`](JUNCTION.md).

This tree does not require `kiro-cli`. Multi-ACP is already on `main`.

## Why this exists

Junction is a local control plane (dashboard, CLI, messaging channels,
cron, memory) that speaks
[Agent Client Protocol](https://agentclientprotocol.com/) over stdio and
optionally routes inference through a Codex Router sidecar.

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

CLI: `junction`. State still lives under `~/.junction` until a later,
human-gated rename. Package import path stays `junction` /
`JUNCTION_HOME` as implementation identifiers, not as the product name.

Registry: `src/junction/acp/runtimes.py`. Two-plane thesis:
[`ARCHITECTURE.md`](ARCHITECTURE.md). Model catalog and role DAG:
[`docs/system-specs/modules/model-router.md`](docs/system-specs/modules/model-router.md).
