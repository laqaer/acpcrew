"""Junction's displayed product name and primary CLI."""

from __future__ import annotations

from pathlib import Path

from kiro_crew.constants import CLI_BIN, CLI_CONSOLE_STEMS, PRODUCT_NAME

_REPO_ROOT = Path(__file__).resolve().parents[1]


def test_product_name_is_junction() -> None:
    assert PRODUCT_NAME == "Junction"


def test_pyproject_declares_junction_console_script() -> None:
    text = (_REPO_ROOT / "pyproject.toml").read_text(encoding="utf-8")
    assert 'junction = "kiro_crew._bootstrap:main"' in text
    assert 'kirocrew = "kiro_crew._bootstrap:main"' in text
    assert 'acpcrew = "kiro_crew._bootstrap:main"' in text
    assert CLI_BIN == "junction"
    assert CLI_CONSOLE_STEMS[0] == CLI_BIN
    assert "kirocrew" in CLI_CONSOLE_STEMS
    assert "acpcrew" in CLI_CONSOLE_STEMS
