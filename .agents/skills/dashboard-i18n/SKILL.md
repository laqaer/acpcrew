---
name: dashboard-i18n
description: "Dashboard user-facing strings in website/. Use when adding copy, dates, numbers, or sort order. Never hardcode English. Interpolate {{productName}}. DEFAULT_PRODUCT_NAME is Junction. Catalog-wide rewrite of leftover literals is a follow-up, not this cut."
---

# Dashboard i18n

Authoring: [`../../../website/docs/i18n-catalog.md`](../../../website/docs/i18n-catalog.md).
Gates: [`../../../docs/ci/i18n-gates.md`](../../../docs/ci/i18n-gates.md).
Frontend router: [`../../../website/AGENTS.md`](../../../website/AGENTS.md).

## Rules

- Never hardcode a user-facing English string in `website/`.
- Never format a date, number, or sort order without naming a locale
  (`website/src/i18n/format.ts`).
- New copy that names the product writes `{{productName}}`, not a
  literal. Translations must keep the placeholder.
- Junction's `DEFAULT_PRODUCT_NAME` is `Junction`
  (`website/src/i18n/index.ts`).
- Catalog-wide rewrite of pre-existing hardcoded product literals is a
  **follow-up**. Do not sweep 13 locale files in the bootstrap PR.
- Manifest-sync `apps.<id>.manifest.*` keys and repo-attribution strings
  that wrap the upstream GitHub URL stay literal by contract — see the
  catalog doc.
