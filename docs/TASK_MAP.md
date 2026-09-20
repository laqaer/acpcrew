# Junction — task map

Status: **in progress**. Envelope:
[`../WORKING_BRIEF.md`](../WORKING_BRIEF.md). Roadmap:
[`../ROADMAP.md`](../ROADMAP.md). Agent loop:
[ADR 0006](adr/0006-agent-os-no-automerge.md).

Epic: [#16](https://github.com/laqaer/acpcrew/issues/16).
PRs: [#23](https://github.com/laqaer/acpcrew/pull/23) (bootstrap, draft),
[#24](https://github.com/laqaer/acpcrew/pull/24) (model plane, draft).

| Epic / lane | What lands | Surfaces | Status | Issue |
|---|---|---|---|---|
| Freeze | Product name Junction, CLI `junction`, tagline, promise, authority envelope, execution id | [`WORKING_BRIEF.md`](../WORKING_BRIEF.md), [`JUNCTION.md`](../JUNCTION.md), [ADR 0001](adr/0001-product-identity.md) | Done (M0) | [#16](https://github.com/laqaer/acpcrew/issues/16) |
| Docs / agent OS | Product, architecture, ADRs 0002–0006, provenance, overlay skills, router rows | [`PRODUCT.md`](../PRODUCT.md), [`ARCHITECTURE.md`](../ARCHITECTURE.md), [`docs/adr/`](adr/README.md), [`.agents/`](../.agents/README.md) | Open PRs | [#17](https://github.com/laqaer/acpcrew/issues/17) |
| Site | Marketing overlay: Junction, two planes, amber, track motif, no ghost emoji; honest M1 vs M2 copy | `site/` | Preview at [junction-site.vercel.app](https://junction-site.vercel.app) | [#18](https://github.com/laqaer/acpcrew/issues/18) |
| CLI chrome | Primary `junction`; aliases `acpcrew` / `kirocrew` | CLI packaging / entry | This cut | [#19](https://github.com/laqaer/acpcrew/issues/19) |
| Model-router | Observe + compose: health/status, catalog, role DAG; advertised ids actually applied; sidecar slugs skipped until M2 | `src/kiro_crew/model_router/`, [model-router spec](system-specs/modules/model-router.md) | Open PRs | [#20](https://github.com/laqaer/acpcrew/issues/20) |
| GitHub / CI / preview | Epic issues; site CI; Vercel preview of `site/` only | `.github/workflows/site.yml`, Vercel hobby preview | This cut | [#21](https://github.com/laqaer/acpcrew/issues/21) |
| Integration-owner | End-to-end check that lanes compose; no merge, no production, no spend | [ADR 0005](adr/0005-preview-not-production.md), skill `integration-owner` | This cut | [#16](https://github.com/laqaer/acpcrew/issues/16) |
| Ship program | Chrome rewrite, routing fixes, ship + maintain roadmaps, agent-OS loop | this file, [`../ROADMAP.md`](../ROADMAP.md), [ADR 0006](adr/0006-agent-os-no-automerge.md) | This PR | ship-program |
| M2 router install | Operator-install of published Codex Router; optional `openai_base_url`; secrets stay in the sidecar | Docs + later compose | Follow-up | [#22](https://github.com/laqaer/acpcrew/issues/22) |
| M3 domain | Human confirms a quoted domain, pays, attaches DNS to `junction-site` | Vercel registrar | Blocked on spend | domain |
| Maintain | Scout → implement → review → human merge; adversarial passes; catalog refresh | ADR 0006 | Ongoing | agent-os |

## Out of this cut

Merge; GitHub rename; package / data-home rename; PyPI / Docker / DNS /
paid Vercel; vendoring Codex Router; copying tray / widget / Electron /
public Cursor HTTPS tunnel / ACP agent bridges; reimplementing LiteLLM;
whole-tree i18n rewrite; `CHANGELOG.md`; auto-merge of agent PRs.
