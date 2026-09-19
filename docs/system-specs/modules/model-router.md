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

This cut exposes **health** and **status** only. Operator-install of the
sidecar and optional `openai_base_url` are M2
([`../../../ROADMAP.md`](../../../ROADMAP.md)).

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

- CLI: `junction router status` (the `kirocrew` and `acpcrew` aliases dispatch
  the same command).
- HTTP: `GET /api/model-router/status`. HTTP 200 with a coarse `status` of
  `healthy`, `degraded`, or `unreachable`, plus per-endpoint `code` values.
  An unreachable sidecar is degraded, not a 5xx.
- Probe URLs: `http://127.0.0.1:{router}/health` and
  `http://127.0.0.1:{gateway}/health/liveliness`. Ports come from
  `model_router.probe` (`DEFAULT_ROUTER_PORT` 4202, `DEFAULT_GATEWAY_PORT`
  4200) and the `MODEL_ROUTER_PORT` / `CODEX_ROUTER_PORT` environment
  variables Codex Router already honors.
