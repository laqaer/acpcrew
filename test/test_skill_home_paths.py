"""Guard: agent- and user-facing text must name the ONE data home, ``~/.junction``.

Junction keeps a single data home. Skill files, system prompts, MCP tool-schema
descriptions and the shipped user docs all *tell* an agent or a user where to
read and write, so a line naming a retired home sends an obedient agent to a
directory the gateway never reads -- it re-creates that directory by hand and
then has its cron script, secret read, or venv refused.

The retired spellings are the upstream product's two homes: a top-level
dot-directory named after it, and a ``crew`` child of ``~/.kiro`` (in either
separator). Both are assembled from fragments below so this file does not itself
carry them. ``~/.kiro`` on its own stays legitimate:
it is kiro-cli's home, which Junction drives as a harness, so only the
``crew`` child is matched.

Deliberately NOT covered: production modules, which the runtime write-path
guard (``test_runtime_home_write_paths.py``) covers, and top-level ``docs/``,
which holds dated design records that describe the layout as it was.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]

SKILL_SUFFIXES = {".md", ".sh", ".py"}

CURRENT_HOME_POSIX = "~/.junction"

# The retired name, held in variables so this file never spells the path it guards.
_KIRO = "kiro"
_CREW = "crew"
RETIRED_HOME = re.compile(rf"\.{_KIRO}{_CREW}|\.{_KIRO}[/\\]{_CREW}")


def _skill_files() -> list[Path]:
    """Every skill-authored file: top-level skills/, packaged builtin_skills/, plus app-bundled skills/."""
    roots = [REPO_ROOT / "skills", REPO_ROOT / "src" / "junction" / "builtin_skills"]
    roots += sorted((REPO_ROOT / "src" / "junction" / "apps" / "builtins").glob("*/skills"))
    files: list[Path] = []
    for root in roots:
        if not root.is_dir():
            continue
        files += [p for p in sorted(root.rglob("*")) if p.is_file() and p.suffix in SKILL_SUFFIXES]
    return files


def _offenders(paths: list[Path]) -> list[str]:
    found: list[str] = []
    for path in paths:
        for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            if RETIRED_HOME.search(line):
                found.append(f"{path.relative_to(REPO_ROOT)}:{lineno}: {line.strip()[:120]}")
    return found


def test_skill_files_exist() -> None:
    """Confidence check: the guard is actually scanning something."""
    files = _skill_files()
    assert len(files) > 10, f"expected to find skill files, got {len(files)}"


def test_no_skill_names_a_retired_data_home() -> None:
    offenders = _offenders(_skill_files())
    assert not offenders, (
        f"Skill files must use the data home ({CURRENT_HOME_POSIX}), never a "
        "retired one:\n  " + "\n  ".join(offenders)
    )


def test_skills_name_the_current_data_home() -> None:
    """The guard above passes vacuously if no skill names a home at all."""
    joined = "\n".join(p.read_text(encoding="utf-8") for p in _skill_files())
    assert CURRENT_HOME_POSIX in joined


def test_retired_pattern_leaves_the_harness_home_alone() -> None:
    """``~/.kiro`` is kiro-cli's own home; only its ``crew`` child is retired."""
    assert not RETIRED_HOME.search("cat ~/.kiro/settings/cli.json")
    assert not RETIRED_HOME.search("~/.kiro/agents/default.json")
    assert RETIRED_HOME.search(f"SECRET=$(cat ~/.{_KIRO}/{_CREW}/.local_secret)")
    assert RETIRED_HOME.search(f"%USERPROFILE%\\.{_KIRO}\\{_CREW}\\crons")
    assert RETIRED_HOME.search(f"~/.{_KIRO}{_CREW}-pods")


# The system prompts, the MCP tool-schema descriptions and the review rules also
# tell an agent where to write. Scope is an explicit list rather than a glob: a
# NEW MCP tool that puts a retired path in its schema description is caught by
# neither this list nor the runtime write-path guard.
AGENT_INSTRUCTION_FILES = (
    "src/junction/config/prompt.md",
    "src/junction/config/prompt-orchestrator.md",
    "src/junction/mcp_cron.py",
)


def test_agent_instruction_surfaces_do_not_name_a_retired_home() -> None:
    """``config/prompt.md`` names the cron-script directory an agent must use.

    ``cron_script.py`` enforces ``config_dir()/crons``, so a prompt naming any
    other home makes an obedient agent create the wrong directory and then have
    its registration refused.
    """
    paths = [REPO_ROOT / rel for rel in AGENT_INSTRUCTION_FILES if (REPO_ROOT / rel).is_file()]
    assert len(paths) >= 3, f"guard scanned too few instruction surfaces: {len(paths)}"
    offenders = _offenders(paths)
    assert not offenders, (
        f"An agent-instruction surface names a retired data home. Use "
        f"{CURRENT_HOME_POSIX}:\n  " + "\n  ".join(offenders)
    )


def test_shipped_user_docs_do_not_name_a_retired_home() -> None:
    """``src/junction/docs/`` is packaged and surfaced in-product."""
    root = REPO_ROOT / "src" / "junction" / "docs"
    if not root.is_dir():
        pytest.skip("shipped docs directory not present")

    files = [p for p in sorted(root.rglob("*.md")) if p.is_file()]
    assert len(files) > 5, f"guard scanned too few shipped docs: {len(files)}"
    offenders = _offenders(files)
    assert (
        not offenders
    ), f"Shipped user docs must state the data home ({CURRENT_HOME_POSIX}):\n  " + "\n  ".join(
        offenders
    )
