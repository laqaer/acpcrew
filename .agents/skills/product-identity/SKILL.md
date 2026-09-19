---
name: product-identity
description: "Junction product identity freeze. Use when naming the product, CLI, tagline, README/site/CLI chrome, or deciding whether an identifier may change. Prevents un-freezing the name, renaming kiro_crew / KIROCREW_HOME, or writing the concatenated upstream brand token in new prose."
---

# Product identity — Junction

The product is **Junction**. One word, capital J. CLI `junction`. Tagline:
Where coding agents meet the models you want.

Read first: [`../../../JUNCTION.md`](../../../JUNCTION.md),
[`../../../WORKING_BRIEF.md`](../../../WORKING_BRIEF.md),
[`../../../PRODUCT.md`](../../../PRODUCT.md),
[`../../../docs/adr/0001-product-identity.md`](../../../docs/adr/0001-product-identity.md).

## Rules

- Not the product: acpcrew, Kiro Crew, Codex Router, Hearth, Relay, Rudder.
- "Kiro Crew" (two words) names the **upstream** project only.
- Brand gate is diff-scoped: do not write concatenated `KiroCrew` in new
  prose.
- Identifiers that stay this cut: `kiro_crew`, `KIROCREW_HOME`,
  `~/.kiro/crew`, Electron `productName`, GitHub slug `laqaer/acpcrew`,
  PyPI `kirocrew`.
- Aliases `acpcrew` and `kirocrew` still invoke the same entry point.
- Do not edit `CHANGELOG.md` on a feature PR.
