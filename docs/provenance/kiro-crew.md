# Provenance — Kiro Crew

Junction's harness plane and gateway are an Apache-2.0 fork of
[Kiro Crew](https://github.com/kirodotdev/KiroCrew)
(`kirodotdev/KiroCrew`). Junction is the product name of this checkout;
Kiro Crew is the upstream project.

## License and head

- **License:** Apache-2.0. Keep `LICENSE`, `NOTICE`, and
  `THIRD-PARTY-NOTICES`.
- **This fork's GitHub slug:** `laqaer/acpcrew` until a human rename.
- **Bootstrap base:** `main` at `78424fb73` (see
  [`../../WORKING_BRIEF.md`](../../WORKING_BRIEF.md)).
- **Multi-ACP:** already on `main`. Default `agent.acp_backend` is
  `auto`. Registry: `src/kiro_crew/acp/runtimes.py`. Do not re-land it.
  Facts: [`../../FORK.md`](../../FORK.md).

## What this fork keeps

The Python gateway, dashboard, memory, cron, skills, MCP, governance, and
the keystone. Package identifiers stay `kiro_crew` / `KIROCREW_HOME` /
`~/.kiro/crew` until a dedicated rename.

`kiro-cli` remains a selectable ACP backend and is **not** required.

## What this fork must not restore

Internal Amazon services, other `agent.provider` values, Channels in the
App Store, the Board app, and the rest of the public-OSS scrub list in
[`../../AGENTS.md`](../../AGENTS.md). Rationale:
[`../system-specs/post-launch-removals.md`](../system-specs/post-launch-removals.md).
