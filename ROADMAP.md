# Roadmap

Identity freeze, bootstrap, then a model catalog that starts with
`junction up`. No calendar estimates.

Frozen identity: [`WORKING_BRIEF.md`](WORKING_BRIEF.md). Lane map:
[`docs/TASK_MAP.md`](docs/TASK_MAP.md). Agent loop:
[ADR 0006](docs/adr/0006-agent-os-no-automerge.md).

## Ship

### M0 — identity freeze

**Done.** Product is Junction. CLI `junction`. Tagline and promise frozen.
ADR [0001](docs/adr/0001-product-identity.md). Envelope and execution id in
[`WORKING_BRIEF.md`](WORKING_BRIEF.md).

### M1 — bootstrap PR

**Merged** as [#23](https://github.com/myrmitis/junction/pull/23). Contributor
docs, `site/` overlay, CLI chrome, model-router health, Vercel hobby preview.

### M1.5 — model plane catalog + role DAG

**Merged** as [#24](https://github.com/myrmitis/junction/pull/24). Namespaced
catalog, role DAG, Settings pins. Unpinned roles stay `"auto"`.

### M1.6 — ship program (this cut)

**Open** as [#26](https://github.com/myrmitis/junction/pull/26) on
`cursor/junction-ship-program-55da`. Do not merge in agent executions.

- Advertised-model lookup actually calls ACP `available_models`.
- `set_model` skips namespaced sidecar slugs until M2.
- Economy roles fall back to the cheapest advertised id, not a flagship.
- User-facing chrome (dashboard title, Electron splash, channel `/help`,
  cold-start HTML) says Junction.
- Marketing site copy matches what the gateway does today.
- Ship + maintain roadmaps and the agent-OS loop (no auto-merge).

### M2 — built-in model catalog

**Implemented in this checkout. Not on `main` until a human merges.**
`junction up` binds a loopback catalog listener and serves `/health` and
`/catalog`. Provider translation is not bundled. Completion routes answer
`501` with `code` `model_router_no_forward`. `junction router` does not
claim a sidecar injects keys. Secrets stay out of chat and out of the data
home. A busy port is left to whatever already owns it.

The test to run before marketing is
[What a successful test looks like](docs/guides/install.md#what-a-successful-test-looks-like).

### M3 — production marketing site

The public host is **https://getjunction.dev**. `www.getjunction.dev`
redirects there. Branch deploys stay on
[junction-site.vercel.app](https://junction-site.vercel.app).

`junction.computer` is not the host. It was a quoted name, it was not
purchased, and it has no public DNS. Do not buy it from an agent, and do
not point the site at it.

Other names quoted in the same pass, also not purchased:

| Domain | 1-year list | Renewal |
|---|---|---|
| `getjunction.dev` | $9.99 | $13 |
| `withjunction.dev` | $9.99 | $13 |
| `tryjunction.dev` | $9.99 | $13 |
| `junction.software` | $29.99 | $32 |
| `junction.computer` | $33.99 | $32 |

`junction.dev` / `.app` / `.ai` / `.so` / `.run` and `usejunction.com` are
taken. Agents must not buy a domain or change DNS.

### M4 — identity leftovers

- Package import path is `junction`. Env is `JUNCTION_HOME`. A new install
  uses `~/.junction`. An older data directory is still opened when the new
  one is absent, and it stays on the security floor.
- GitHub slug is `myrmitis/junction`. Site is https://getjunction.dev.
- Catalog-wide dashboard i18n (`{{productName}}` already binds new copy)
  still has older path spellings in some locale strings.

### M5 — publish

PyPI / Docker / GitHub Releases. Human-gated. `CHANGELOG.md` is written only
at a version bump.

## Maintain

No calendar cadence in this file — the loop is event-shaped.

1. **Scout.** An agent (or Dependabot) finds a defect, a stale catalog slug,
   a brand leftover, or a CI flake. It files a GitHub issue. It does not
   open a PR from the scout run unless the issue is already labeled
   `agent-os/ready`.
2. **Implement.** A second agent picks `agent-os/ready` issues, works on a
   `cursor/*` branch, opens a draft PR, and waits.
3. **Review.** A third agent reviews the PR (tests, keystone, harness-parity,
   identity). It may request changes or label `agent-os/approved`.
4. **Merge.** A human merges. Agents never merge, never auto-approve their
   own PRs, and never push to `main`.
5. **Adversarial pass.** After a model-plane or identity cut, run a
   read-only review agent that is rewarded for finding bugs, not for
   agreeing. File what it finds; do not let it edit in the same turn.
6. **Catalog refresh.** When Codex Router's registry changes, update
   `model_router/catalog.json` as a snapshot — slugs and labels only.
7. **Security floor.** Keystone, governance, `CONTRACT_VERSION` 1, computer
   use in-band, positive harness identity. An upstream sync must not weaken
   them or restore Channels / Board.
8. **CI.** Keep the existing gates. A flake is a bug, not a rerun.

Cursor Automations that spawn those three roles are created in the Cursor
dashboard (this repo cannot register them from a PR). The handoff contract
is [ADR 0006](docs/adr/0006-agent-os-no-automerge.md).

## What else

Worth doing, not on the bootstrap PR:

- Confirm a domain from the M3 table and attach it to `junction-site`
  ([#27](https://github.com/myrmitis/junction/issues/27)).
- Provider translation is intentionally not bundled. Do not vendor another
  product's router tree to get it.
- Remaining dashboard catalog literals (`en.json` / locale values) in
  reviewable chunks ([#28](https://github.com/myrmitis/junction/issues/28)).
- Packaged user docs under `src/junction/docs/` still say the old CLI in
  places; rewrite as a docs PR, not a silent sweep.
- Create Cursor Automations for scout / implementer / reviewer, and mint
  the `agent-os/*` labels once ([#29](https://github.com/myrmitis/junction/issues/29)).
- Adversarial leftovers: orchestration apply site, brand-gate teaching text
  ([#30](https://github.com/myrmitis/junction/issues/30)).
- PyPI name reservation for `junction` when publish is real.
- A short demo recording on the marketing site once M2 is true.
- Do not present Junction as a public fork. Do not vendor Codex Router.
