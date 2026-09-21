# Getting Started with Junction

Junction is a local control plane: dock ACP coding agents and route their
models. Chat from the web dashboard, the CLI, or a messaging channel.
`kiro-cli` is optional.

## Prerequisites

| Requirement | Needed for | Floor |
|-------------|------------|-------|
| **Python** + pip | Backend | `>= 3.10` |
| **Node.js** + npm | Building the dashboard from source | `>= 22` (24 LTS recommended) |
| An ACP runtime | Driving the LLM | Cursor, Claude, Codex, Grok, … — `kiro-cli` is optional |

Node is only needed to *build* the dashboard. A source install that already
has `website/dist` staged does not need Node at runtime.

**Platforms: macOS, Linux, and Windows.** Windows runs natively from a Python
source install and is launched as `python -m kiro_crew gateway` or `junction gateway`.

## Installation

Junction ships from source. There is no public CDN installer in this cut.

```bash
git clone https://github.com/laqaer/acpcrew.git
cd acpcrew
python3 -m venv .venv && source .venv/bin/activate
cd website && npm install && npm run build && cd ..
pip install -e ".[dev]"
junction setup
junction doctor --quick
junction gateway
```

The dashboard has to be built before the backend install, because the built
`website/dist` is staged into the package and served by the gateway. `make
build` does both steps plus a `.venv`.

The dashboard is `http://localhost:5476`.

Optional model plane: run a Codex Router sidecar on loopback, then
`junction planes` for both rails, `junction router catalog` for namespaced
model choices, and `junction router plan` for the orchestration → planning →
execution DAG. Never paste provider keys into chat.

### Agent backend (kiro-cli optional)

`agent.provider` is `acp`. `agent.acp_backend` defaults to `auto`: Junction
docks the first installed of Cursor, Claude, Codex, Kimi, DeepSeek Harness,
Goose, Grok, Pi, Droid. `kiro-cli` remains selectable and last in that list.
Install `kiro-cli` only when you want that harness:

```bash
kiro-cli login
```

## First-Time Setup

```bash
junction setup
junction doctor
junction gateway
```

Silent aliases `acpcrew` and `kirocrew` still dispatch to the same CLI.
User-facing help prints `junction`.

Connect Slack, Discord, or other channels later from the dashboard
(Settings → Channels).

## Docs

Site: https://getjunction.dev

Source: https://github.com/laqaer/acpcrew
