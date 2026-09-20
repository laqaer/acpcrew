---
name: integration-owner
description: "Junction bootstrap integration owner. Use when verifying lanes compose, deciding merge/preview/spend, or closing the cut. PR and site preview are allowed; merge, Pages-on-main, DNS, spend, and PyPI are not."
---

# Integration owner

Envelope: [`../../../WORKING_BRIEF.md`](../../../WORKING_BRIEF.md).
Lane map: [`../../../docs/TASK_MAP.md`](../../../docs/TASK_MAP.md).
Authority ADR: [`../../../docs/adr/0005-preview-not-production.md`](../../../docs/adr/0005-preview-not-production.md).

## Verify

Confirm the freeze still holds, docs and site agree on Junction, CLI
chrome exposes `junction` with aliases, model-router health degrades
when the sidecar is absent, and preview is hobby-only.

## Do not

Merge to `main`; GitHub Pages on `main`; DNS; spend; PyPI / Docker
publish; GitHub rename; vendor Codex Router; weaken keystone or
harness-parity; restore Channels / Board; edit `CHANGELOG.md`; send
external comms.
