---
name: model-router
description: "Junction model plane: observe the optional Codex Router sidecar. Use when adding health/status, catalog, role DAG, probing :4202/:4200, or wiring openai_base_url. Do not vendor the Node tree, log secrets, or crash the gateway when the sidecar is absent."
---

# Model router — observe, do not vendor

Contract: [`../../../docs/system-specs/modules/model-router.md`](../../../docs/system-specs/modules/model-router.md).
Code: `src/junction/model_router/`. ADRs
[0002](../../../docs/adr/0002-two-planes.md),
[0003](../../../docs/adr/0003-sidecar-not-vendor.md).
Provenance: [`../../../docs/provenance/codex-router.md`](../../../docs/provenance/codex-router.md).

## Rules

- Health, namespaced catalog, and role DAG. Operator-install of the
  sidecar is M2.
- If the sidecar is absent, the ACP gateway still runs (degraded).
- Never log secrets. Never paste provider keys into chat.
- Do not copy tray, widget, Electron, HTTPS tunnel, or ACP agent
  bridges. Do not reimplement LiteLLM.
- Catalog JSON copies slugs and labels only. Never hardcode a model id
  as a default; unpinned roles stay `"auto"`.
