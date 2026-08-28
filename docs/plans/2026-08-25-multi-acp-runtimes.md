# Multi-ACP runtimes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make this KiroCrew fork drive Cursor, Claude, Codex, DeepSeek Harness, Pi, and other ACP agents without requiring kiro-cli.

**Architecture:** A stdlib-friendly registry (`src/kiro_crew/acp/runtimes.py`) maps backend ids to spawn argv and ACP v1 vs kiro handshake. `AcpClient._spawn` and `AcpProvider.start` consume it. Default config is `auto`.

**Tech Stack:** Python 3.10+, existing KiroCrew ACP client, pytest.

---

### Task 1: Runtime registry

**Files:**
- Create: `src/kiro_crew/acp/runtimes.py`
- Test: `test/test_acp_runtimes.py`

**Step 1:** Tests for auto-select (cursor over kiro, skip missing, kiro last-resort).
**Step 2:** Implement `RuntimeSpec`, `select_runtime`, `resolve_spawn_argv`.
**Step 3:** `pytest test/test_acp_runtimes.py -q`

### Task 2: Backend identifiers

**Files:**
- Modify: `src/kiro_crew/acp/types.py`
- Modify: `src/kiro_crew/config/loader.py` (`AgentConfig.acp_backend` default `auto`, `_normalize_acp_backend`)

### Task 3: Spawn + handshake

**Files:**
- Modify: `src/kiro_crew/acp/client.py` (`_is_spec`, auto-resolve, spec-family spawn, protocolVersion 1)
- Modify: `src/kiro_crew/providers/acp.py` (`_resolve_auto_backend`, `is_spec_backend`, `provider_label`)

### Task 4: Upstream tests that assumed kiro-default

**Files:**
- Modify: `test/test_acp_backend_kas.py`
- Modify: `test/test_harness_parity.py`
- Regenerate: `config-baseline.json`

### Task 5: Fork surface

**Files:**
- Create: `FORK.md`
- Modify: `README.md`, `NOTICE`, `pyproject.toml` (`acpcrew` script)
