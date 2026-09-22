# Model router — observe and compose the sidecar

**This is the change-control contract for `src/kiro_crew/model_router/`.**
Read it before changing that package. Update it in the same commit when
behavior documented here changes.

Junction's **model plane** is an optional [Codex Router](https://github.com/duolahypercho/codex-router)
sidecar on loopback. This module **observes and composes** it. It does
not vendor the Node tree, start a bundled LiteLLM, or store provider
keys.

Thesis: [`../../../ARCHITECTURE.md`](../../../ARCHITECTURE.md).
Decisions: [ADR 0002](../../adr/0002-two-planes.md),
[ADR 0003](../../adr/0003-sidecar-not-vendor.md).
Provenance: [`../../provenance/codex-router.md`](../../provenance/codex-router.md).
Security floor: [ADR 0004](../../adr/0004-security-unchanged.md) — this
module does not weaken keystone, governance, or harness-parity.

## Role

The Python gateway already docks ACP agents (harness plane). The model
plane is a second process family:

| Listener | Typical bind | Role |
|---|---|---|
| Codex Router | `127.0.0.1:4202` | Responses / OpenAI-compatible entry |
| LiteLLM | `127.0.0.1:4200` | Protocol translation to providers |

Ports and host are constants owned by `src/kiro_crew/model_router/` when
that package lands. Call sites import them; they are not restated as
literals in CLI chrome or dashboard copy.

This cut exposes **health**, the **namespaced model catalog**, and a
**role DAG** (orchestration → planning → execution). Operator-install of
the sidecar and optional `openai_base_url` remain M2
([`../../../ROADMAP.md`](../../../ROADMAP.md)).

`available_models` on ACP clients is a **method**. Role apply calls it;
treating the bound method as a list left every unpinned role on `"auto"`.

`apply_role_model` sends `set_model` only for harness ids (no `/`). A
namespaced catalog slug is returned as the plan's wire id but is not
sent on the kiro-cli wire until M2.

Economy roles with no advertised economy id pick the cheapest advertised
id rather than inheriting a flagship session default. Capable and
standard roles still inherit `"auto"` when their class is empty.

## Health and status

Status is a coarse enum the dashboard, CLI, and doctor can show. This
cut does **not** scan the disk for an install (that would look like
credential discovery). An uninstalled sidecar and a down listener are
the same probe result: `unreachable`.

| Status | Meaning |
|---|---|
| `unreachable` | Neither loopback listener answered. Includes "not installed." |
| `degraded` | Partial: router up and LiteLLM down, or the reverse. |
| `healthy` | Both loopback listeners answer without secrets in the body. |

Health probes hit the sidecar's own public health routes on loopback.
They do not scrape env files, capability URLs, or credential stores.

**If the sidecar is absent or unhealthy, the ACP gateway still runs.**
That is degraded, documented, and not a crash. Harness sessions do not
depend on `:4202`.

## Catalog

`model_router/catalog.json` is a snapshot of Codex Router's namespaced
model choices (slugs, labels, provider ids, listed flag, context window).
It does **not** copy credentials, endpoints, or secret filenames.

- Static providers list every `provider/model` slug the registry ships.
- Live-catalog providers (GitHub Copilot, Groq, local Ollama, …) appear
  as provider rows without hardcoded model ids; the operator curates
  those on the sidecar.
- Grammar for a pin that may be a kiro-cli id **or** a namespaced slug
  is `MODEL_ID_PATTERN` in `catalog.py` (slash allowed as a namespace
  separator; `..`, `//`, `/.`, and a leading or trailing slash are not).

## Role DAG

Roles are `orchestration`, `planning`, `execution`, `background`, and
`subagent` (`ROUTE_ROLE_KEYS`). Edges:

`orchestration → planning → execution → subagent`

`background` is a side node (heartbeat), not on the run path.

Each role has a cost class so tokens buy the most work:

| Role | Cost class | Why |
|---|---|---|
| orchestration | economy | Control traffic; many tokens, little need for flagship capability |
| planning | capable | Rare, high-leverage decomposition |
| execution | standard | Bulk of coding tokens |
| background | economy | Unattended lite workers |
| subagent | standard | Fan-out workers |

Pins in `agent.role_models.<role>` always win. Unpinned roles resolve to
`"auto"` unless the caller supplies an advertised id set, in which case
the pick is an advertised id in that cost class. Concrete model ids are
never hardcoded as defaults. Task-runner decompose uses planning;
execute and self-review use execution / planning via `apply_role_model`.
Orchestrator chat turns (unpinned slots) pick through
`orchestrator_turn_role`: planning for the plan turn, orchestration for
synthetic coordinator turns (subagent synthesis, recovery), and
execution for stage runs. Synthesis is excluded from plan-arming so it
cannot re-count a plan.

`GET /api/model-router/catalog` annotates each slug with `cost_class`.
Settings ▸ Chat lists catalog slugs in the matching class beside
advertised kiro-cli ids, so operators can pin `kimi-oauth/k3` without
typing it.

## Secrets

- Never log provider keys, caller keys, capability URLs, or cookie
  headers.
- Never paste keys into chat, prompts, issues, or health payloads.
- Never copy Codex Router credentials into `KIROCREW_HOME` to “make
  status work.”
- Status JSON carries machine-readable `code` values on non-success;
  it does not echo secret material.

A future `openai_base_url` pointing at the sidecar is operator config
on the **agent** side. Junction does not mint that URL in chat.

## What this module is not

- Not a LiteLLM rewrite.
- Not a vendor of tray, widget, Electron, public Cursor HTTPS tunnel, or
  Codex Router's experimental ACP agent bridges (those overlap
  `src/kiro_crew/acp/runtimes.py` — do not copy).
- Not a governance scope (`computer_use.*` stays off limits; the model
  plane is not computer use).
- Not a second `agent.provider`. Harness selection stays
  `agent.acp_backend`.

## Invariants

1. Observe, do not vendor.
2. Loopback only for probes this cut.
3. Degrade open: missing sidecar ≠ gateway failure.
4. No secrets in logs, status, or chat.
5. Positive harness identity elsewhere is untouched by this package.

## This-cut surface

- CLI: `junction up` (compose then serve; `junction gateway` is the same
  server), `junction planes` (human; `--json` for the machine snapshot of
  harness inventory, sidecar health, and the role DAG), `junction doctor --quick`
  (compose-only), `junction doctor` (Planes section first, then the full probe),
  `junction router status`, `junction router catalog`,
  `junction router plan`. Human text is one formatter shared by planes, doctor,
  and the `up` start banner.
- HTTP: `GET /api/planes` (harness inventory + sidecar health + role DAG),
  `GET /api/model-router/status`, `GET /api/model-router/catalog`,
  `GET /api/model-router/plan`. Unreachable sidecar is degraded, not a 5xx.
- Probe URLs: `http://127.0.0.1:{router}/health` and
  `http://127.0.0.1:{gateway}/health/liveliness`. Ports come from
  `model_router.probe` (`DEFAULT_ROUTER_PORT` 4202, `DEFAULT_GATEWAY_PORT`
  4200) and the `MODEL_ROUTER_PORT` / `CODEX_ROUTER_PORT` environment
  variables Codex Router already honors.
- Config: `agent.role_models` keys listed in `ROLE_MODEL_KEYS`.
