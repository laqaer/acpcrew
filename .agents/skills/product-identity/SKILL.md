---
name: product-identity
description: "Junction product identity freeze. Use when naming the product, CLI, tagline, README/site/CLI chrome, or deciding whether an identifier may change. The Python package is junction. Prevents writing the concatenated upstream brand token in new prose."
---

# Product identity — Junction

The product is **Junction**. One word, capital J. CLI `junction`. Tagline:
Where coding agents meet the models you want.

Read first: [`../../../JUNCTION.md`](../../../JUNCTION.md),
[`../../../WORKING_BRIEF.md`](../../../WORKING_BRIEF.md),
[`../../../PRODUCT.md`](../../../PRODUCT.md),
[`../../../docs/adr/0001-product-identity.md`](../../../docs/adr/0001-product-identity.md).

## Rules

- Not the product: Codex Router, Hearth, Relay, Rudder.
- Do not present Junction as a public fork in README, site, CLI help, or
  prompts.
- Brand gate is diff-scoped: do not write concatenated `KiroCrew` in new
  prose.
- The Python package is `junction`. Environment variables are `JUNCTION_*`.
  A process still copies a previous `KIROCREW_*` value when the new name is
  unset, so an existing data home keeps loading. The security deny list still
  matches the previous command spelling and `~/.kirocrew`.
  GitHub slug is `myrmitis/junction`.
- Do not edit `CHANGELOG.md` on a feature PR.
