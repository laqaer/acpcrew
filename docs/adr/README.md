# Architecture Decision Records

Short, numbered records of product and architecture decisions for Junction.
These are not RFCs: they describe **what was decided**, not a proposal still
under debate. For large contested upstream designs see
[../request-for-change/](../request-for-change/README.md).

| ADR | Decision |
|---|---|
| [0001 — Product identity](0001-product-identity.md) | The product is Junction. |
| [0002 — Two planes](0002-two-planes.md) | Harness plane and model plane are composed, not dumped. |
| [0003 — Sidecar not vendor](0003-sidecar-not-vendor.md) | Do not vendor Codex Router. The install-a-sidecar consequence is superseded by 0007. |
| [0004 — Security unchanged](0004-security-unchanged.md) | Keystone, governance, `CONTRACT_VERSION` 1, computer use in-band, positive harness identity. |
| [0005 — Preview not production](0005-preview-not-production.md) | PR and `site/` preview only; no merge, Pages-on-main, DNS, spend, or PyPI. |
| [0006 — Agent OS, no auto-merge](0006-agent-os-no-automerge.md) | Scout files, implementer PRs, reviewer labels; a human merges. |
| [0007 — Built-in model catalog](0007-builtin-model-catalog.md) | `junction up` serves loopback health and catalog. No provider forwarding, no vendored tree. |

Frozen envelope: [`../../WORKING_BRIEF.md`](../../WORKING_BRIEF.md).
Architecture thesis: [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md).
