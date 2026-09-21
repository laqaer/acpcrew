"""User-facing identity is Junction, not a public fork of another product."""

from __future__ import annotations

from pathlib import Path

from kiro_crew import cli_help
from kiro_crew.constants import CLI_BIN, PRODUCT_NAME, SITE_URL

_REPO_ROOT = Path(__file__).resolve().parents[1]


def test_readme_and_product_are_junction() -> None:
    readme = (_REPO_ROOT / "README.md").read_text(encoding="utf-8")
    product = (_REPO_ROOT / "PRODUCT.md").read_text(encoding="utf-8")
    assert PRODUCT_NAME == "Junction"
    assert CLI_BIN == "junction"
    assert SITE_URL == "https://junction.computer"
    assert "# Junction" in product or product.startswith("# Junction")
    assert "Where coding agents meet the models you want" in readme
    assert "Kiro Crew" not in readme
    assert "KiroCrew" not in readme
    assert "download.crew.kiro.dev" not in readme
    assert "this checkout forks" not in product.lower()
    assert "Apache-2.0 fork" not in product
    notice = (_REPO_ROOT / "NOTICE").read_text(encoding="utf-8")
    assert "this fork" not in notice.lower()
    assert "modified version of" not in notice
    assert "Junction" in notice
    assert (_REPO_ROOT / "TREE.md").is_file()
    assert not (_REPO_ROOT / "FORK.md").exists()
    tree = (_REPO_ROOT / "TREE.md").read_text(encoding="utf-8")
    assert tree.lstrip().startswith("# Junction")
    assert "this fork" not in tree.lower()
    adr = (_REPO_ROOT / "docs/adr/0001-product-identity.md").read_text(encoding="utf-8")
    assert "is a mature Apache-2.0 fork" not in adr


def test_cli_help_is_junction() -> None:
    assert cli_help.TOP_USAGE.startswith("junction ")
    rendered = cli_help.render_epilog()
    assert "junction gateway" in rendered
    assert "  planes" in rendered
    assert "harness + model plane" in rendered
    assert "Kiro Crew" not in rendered
    assert "kirocrew gateway" not in rendered


def test_packaged_getting_started_is_junction() -> None:
    gs = (_REPO_ROOT / "src/kiro_crew/docs/getting-started.md").read_text(encoding="utf-8")
    assert "Junction" in gs
    assert "kiro-cli is optional" in gs
    assert "download.crew.kiro.dev" not in gs
    assert "kirodotdev/KiroCrew" not in gs
    assert "junction gateway" in gs


def test_agents_md_leads_with_junction() -> None:
    agents = (_REPO_ROOT / "AGENTS.md").read_text(encoding="utf-8")
    assert agents.lstrip().startswith("# Rules")
    assert "Junction is a local control plane" in agents
    assert "Kiro Crew is an open-source personal AI agent" not in agents
    assert "this is a public OSS fork" not in agents.lower()
