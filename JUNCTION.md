# Junction — fork overlay

Read this **before** `AGENTS.md` rules that still say Kiro Crew. This checkout
is Junction: a local control plane that docks ACP agents and routes their
models. Upstream Kiro Crew remains the lineage, not the product name.

Frozen identity, authority, and execution id:
[`WORKING_BRIEF.md`](WORKING_BRIEF.md). Identity ADR:
[`docs/adr/0001-product-identity.md`](docs/adr/0001-product-identity.md).
Product / architecture / roadmap: [`PRODUCT.md`](PRODUCT.md),
[`ARCHITECTURE.md`](ARCHITECTURE.md), [`ROADMAP.md`](ROADMAP.md).
Lane map: [`docs/TASK_MAP.md`](docs/TASK_MAP.md).

## Product (do not un-freeze)

- **Name:** Junction. One word. CLI `junction`.
- **Tagline:** Where coding agents meet the models you want.
- **Aliases:** `acpcrew` and `kirocrew` still invoke the same entry point.
- **Not the product:** acpcrew, Kiro Crew, Codex Router, Hearth, Relay, Rudder.

## Two planes

1. **Harness plane** — ACP runtime registry (`src/kiro_crew/acp/runtimes.py`).
   Default `agent.acp_backend` is `auto`. `kiro-cli` is optional.
2. **Model plane** — optional Codex Router sidecar. Junction observes it
   (`src/kiro_crew/model_router/`). It does not vendor the Node tree, copy
   tray/tunnel/agent-bridges, or reimplement LiteLLM.

If the sidecar is down, the gateway still runs. Document that degradation.
Never log secrets. Never paste provider keys into chat.

ADRs: [0002](docs/adr/0002-two-planes.md),
[0003](docs/adr/0003-sidecar-not-vendor.md). Spec:
[`docs/system-specs/modules/model-router.md`](docs/system-specs/modules/model-router.md).

## Identifiers that stay (this cut and until a dedicated rename)

`kiro_crew`, `KIROCREW_HOME`, `~/.kiro/crew`, Electron `productName`, GitHub
slug `laqaer/acpcrew`, PyPI name `kirocrew`. The brand gate still forbids
concatenated `KiroCrew` in **new prose**. Junction is allowed. Do not retarget
the data home.

## Security and harness (do not weaken)

Keystone paths under the data home stay in `security._SENSITIVE_HOME_DIRS`.
Governance is `effective = POLICY ∩ PROFILE` at Kiro Crew's own PreToolUse
gate. Computer use stays ungoverned by scopes. Harness identity is positive
(`is_kiro_backend` / membership sets), never "not Claude". An added harness
adapts; it does not widen the Kiro path.

ADR: [0004](docs/adr/0004-security-unchanged.md).

## Agent OS (this repo)

Fork-local skills live under [`.agents/skills/`](.agents/README.md)
(contributor overlay). They are **not** packaged `builtin_skills`. Index:

| Skill | When |
|---|---|
| `product-identity` | Name, CLI, identifiers that stay |
| `acp-runtimes` | Harness registry, `auto` default |
| `model-router` | Sidecar health/status |
| `security-keystone` | Ceiling and harness-parity floor |
| `integration-owner` | Envelope; no merge / spend |
| `marketing-site` | `site/` overlay and preview |
| `dashboard-i18n` | `{{productName}}`; no hardcoded English |

A skill that any **shipped** feature, tool, or packaged doc references must
still live in `src/kiro_crew/builtin_skills/`. Top-level `skills/` is
checkout-only.

## Docs and changelog

New contributor docs under `docs/` need directory indexes and
`./scripts/docs-lint.sh`. Provenance:
[`docs/provenance/README.md`](docs/provenance/README.md). Do not edit
`CHANGELOG.md` on a feature PR.

## Authority

Branch, commit, PR, issues, and `site/` preview: yes. Merge, production
deploy, DNS, spend, external comms, data deletion, irreversible migrations:
no. Envelope: [`WORKING_BRIEF.md`](WORKING_BRIEF.md). ADR:
[0005](docs/adr/0005-preview-not-production.md).
