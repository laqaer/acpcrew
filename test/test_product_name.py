"""Junction's displayed product name and primary CLI."""

from __future__ import annotations

from pathlib import Path

from junction.constants import CLI_BIN, CLI_CONSOLE_STEMS, PRODUCT_NAME

_REPO_ROOT = Path(__file__).resolve().parents[1]


def test_product_name_is_junction() -> None:
    assert PRODUCT_NAME == "Junction"


def test_pyproject_declares_junction_console_script() -> None:
    text = (_REPO_ROOT / "pyproject.toml").read_text(encoding="utf-8")
    assert 'junction = "junction._bootstrap:main"' in text
    scripts = text.split("[project.scripts]", 1)[1].split("\n[", 1)[0]
    declared = [line.split("=", 1)[0].strip() for line in scripts.splitlines() if "=" in line]
    assert declared == ["junction"]
    assert CLI_BIN == "junction"
    assert CLI_CONSOLE_STEMS == (CLI_BIN,)
