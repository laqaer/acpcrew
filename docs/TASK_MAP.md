# Junction bootstrap — task map

Status: **in progress** on `cursor/junction-bootstrap-55da`. One PR to
`main`; not merged in this execution. Envelope:
[`../WORKING_BRIEF.md`](../WORKING_BRIEF.md). Roadmap:
[`../ROADMAP.md`](../ROADMAP.md).

Epic: [#16](https://github.com/laqaer/acpcrew/issues/16).

| Epic / lane | What lands | Surfaces | Status | Issue |
|---|---|---|---|---|
| Freeze | Product name Junction, CLI `junction`, tagline, promise, authority envelope, execution id | [`WORKING_BRIEF.md`](../WORKING_BRIEF.md), [`JUNCTION.md`](../JUNCTION.md), [ADR 0001](adr/0001-product-identity.md) | Done (M0) | [#16](https://github.com/laqaer/acpcrew/issues/16) |
| Docs / agent OS | Product, architecture, ADRs 0002–0005, provenance, overlay skills, router rows | [`PRODUCT.md`](../PRODUCT.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/adr/`](adr/README.md), [`.agents/`](../.agents/README.md) | This PR | [#17](https://github.com/laqaer/acpcrew/issues/17) |
| Site | Marketing overlay: Junction, two planes, amber, track motif, no ghost emoji | `site/` | This PR | [#18](https://github.com/laqaer/acpcrew/issues/18) |
| CLI chrome | Primary `junction`; aliases `acpcrew` / `kirocrew` | CLI packaging / entry | This PR | [#19](https://github.com/laqaer/acpcrew/issues/19) |
| Model-router | Observe + compose: health/status; degraded if sidecar absent; no secrets | `src/kiro_crew/model_router/`, [model-router spec](system-specs/modules/model-router.md) | This PR | [#20](https://github.com/laqaer/acpcrew/issues/20) |
| GitHub / CI / preview | Epic issues; site CI; Vercel preview of `site/` only | `.github/workflows/site.yml`, Vercel hobby preview | This PR | [#21](https://github.com/laqaer/acpcrew/issues/21) |
| Integration-owner | End-to-end check that lanes compose; no merge, no production, no spend | [ADR 0005](adr/0005-preview-not-production.md), skill `integration-owner` | This PR | [#16](https://github.com/laqaer/acpcrew/issues/16) |
| M2 router install | Operator-install of published Codex Router; optional `openai_base_url`; secrets stay in the sidecar | Docs + later compose | Follow-up | [#22](https://github.com/laqaer/acpcrew/issues/22) |

## Out of this cut

Merge; GitHub rename; package / data-home rename; PyPI / Docker / DNS /
paid Vercel; vendoring Codex Router; copying tray / widget / Electron /
public Cursor HTTPS tunnel / ACP agent bridges; reimplementing LiteLLM;
whole-tree i18n rewrite; `CHANGELOG.md`.
