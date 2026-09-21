"""User-facing identity is Junction, not a public fork of another product."""

from __future__ import annotations

from pathlib import Path

from kiro_crew import cli_help
from kiro_crew.constants import PRODUCT_NAME

_REPO_ROOT = Path(__file__).resolve().parents[1]


def test_readme_and_product_are_junction() -> None:
    readme = (_REPO_ROOT / "README.md").read_text(encoding="utf-8")
    product = (_REPO_ROOT / "PRODUCT.md").read_text(encoding="utf-8")
    assert PRODUCT_NAME == "Junction"
    assert "# Junction" in product or product.startswith("# Junction")
    assert "Where coding agents meet the models you want" in readme
    assert "Kiro Crew" not in readme
    assert "KiroCrew" not in readme  # brand-ok: asserting the concatenated token is absent
    assert "download.crew.kiro.dev" not in readme
    assert "this checkout forks" not in product.lower()
    assert "Apache-2.0 fork" not in product
    adr = (_REPO_ROOT / "docs/adr/0001-product-identity.md").read_text(encoding="utf-8")
    assert "is a mature Apache-2.0 fork" not in adr


def test_cli_help_is_junction() -> None:
    assert cli_help.TOP_USAGE.startswith("junction ")
    rendered = cli_help.render_epilog()
    assert "junction gateway" in rendered
    assert "Kiro Crew" not in rendered
    assert "kirocrew gateway" not in rendered


def test_dashboard_and_electron_chrome_are_junction() -> None:
    index = (_REPO_ROOT / "website" / "index.html").read_text(encoding="utf-8")
    loading = (_REPO_ROOT / "website" / "electron" / "loading.html").read_text(encoding="utf-8")
    assert "<title>Junction</title>" in index
    assert "<title>Kiro Crew</title>" not in index
    assert "<title>Junction</title>" in loading
    assert ">Junction</div>" in loading
    assert ">Kiro Crew</div>" not in loading


def test_agents_md_leads_with_junction() -> None:
    agents = (_REPO_ROOT / "AGENTS.md").read_text(encoding="utf-8")
    assert agents.lstrip().startswith("# Rules")
    assert "Junction is a local control plane" in agents
    assert "Kiro Crew is an open-source personal AI agent" not in agents
    assert "this is a public OSS fork" not in agents.lower()
