# Provenance — gateway lineage

Junction's harness plane and gateway are Apache-2.0. Keep `LICENSE`,
`NOTICE`, and `THIRD-PARTY-NOTICES`. Junction is the product name of
this checkout.

## Head

- **GitHub slug:** `laqaer/junction`.
- **Bootstrap base:** `main` at `78424fb73` (see
  [`../../WORKING_BRIEF.md`](../../WORKING_BRIEF.md)).
- **Multi-ACP:** already on `main`. Default `agent.acp_backend` is
  `auto`. Registry: `src/junction/acp/runtimes.py`. Do not re-land it.
  Facts: [`../../TREE.md`](../../TREE.md).

## What stays

The Python gateway, dashboard, memory, cron, skills, MCP, governance, and
the keystone. The package is `junction`, the environment prefix is
`JUNCTION_`, and a new data home is `~/.junction`. An existing
`~/.kiro/crew` or `~/.kirocrew` is kept when `~/.junction` is absent.

`kiro-cli` remains a selectable ACP backend and is **not** required.

## What must not be restored

Internal Amazon services, other `agent.provider` values, Channels in the
App Store, the Board app, and the rest of the public-OSS scrub list in
[`../../AGENTS.md`](../../AGENTS.md). Rationale:
[`../system-specs/post-launch-removals.md`](../system-specs/post-launch-removals.md).
