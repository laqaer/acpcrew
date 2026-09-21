"""User-facing identity is Junction, not a public fork of another product."""

from __future__ import annotations

import os
import subprocess
from pathlib import Path

from kiro_crew import cli_help
from kiro_crew.constants import CLI_BIN, PRODUCT_NAME, SITE_URL

_REPO_ROOT = Path(__file__).resolve().parents[1]


def test_readme_and_product_are_junction() -> None:
    readme = (_REPO_ROOT / "README.md").read_text(encoding="utf-8")
    product = (_REPO_ROOT / "PRODUCT.md").read_text(encoding="utf-8")
    assert PRODUCT_NAME == "Junction"
    assert CLI_BIN == "junction"
    assert SITE_URL == "https://getjunction.dev"
    assert "# Junction" in product or product.startswith("# Junction")
    assert "Where coding agents meet the models you want" in readme
    assert "the local switch" in readme
    assert "Harness plane" in readme
    assert "junction up" in readme
    assert "Daily Active Instances" in readme
    assert "Daily Active Crews" not in readme
    assert "founding group" not in readme
    assert "Kiro sign-in" not in readme
    assert "github.com/0618.png" not in readme
    assert 'href="https://github.com/laqaer"' in readme
    assert "Kiro Crew" not in readme
    assert "KiroCrew" not in readme  # brand-ok: asserting the concatenated token is absent
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
    assert "junction up" in rendered
    assert "junction gateway" in rendered
    assert "  planes" in rendered
    assert "  up" in rendered
    assert "harness + model plane" in rendered
    assert "Kiro Crew" not in rendered
    assert "kirocrew gateway" not in rendered


def test_packaged_getting_started_is_junction() -> None:
    gs = (_REPO_ROOT / "src/kiro_crew/docs/getting-started.md").read_text(encoding="utf-8")
    plain = gs.replace("`", "")
    assert "Junction" in plain
    assert "vendor agent CLI is optional" in plain
    assert "kiro-cli is optional" not in plain
    assert "download.crew.kiro.dev" not in gs
    assert "kirodotdev/KiroCrew" not in gs
    assert "junction up" in gs
    assert "junction gateway" in gs


def test_public_install_guides_are_junction() -> None:
    install = (_REPO_ROOT / "docs" / "guides" / "install.md").read_text(encoding="utf-8")
    windows = (_REPO_ROOT / "docs" / "guides" / "windows-install.md").read_text(encoding="utf-8")
    docker = (_REPO_ROOT / "docs" / "guides" / "docker.md").read_text(encoding="utf-8")
    compose = (_REPO_ROOT / "docker" / "compose.yaml").read_text(encoding="utf-8")
    assert install.lstrip().startswith("# Installing and running Junction")
    assert "Kiro Crew" not in install
    assert "download.crew.kiro.dev" not in install
    assert "kirocrew gateway" not in install
    assert "kirodotdev/KiroCrew" not in install
    assert "ghcr.io/kirodotdev" not in install
    assert "junction up" in install
    assert "vendor agent CLI is optional" in install
    assert "Kiro Crew" not in windows
    assert "download.crew.kiro.dev" not in windows
    assert "kirocrew gateway" not in windows
    assert "ghost family" not in windows
    assert "junction up" in windows
    assert "ghcr.io/kirodotdev" not in docker
    assert "ghcr.io/laqaer/kirocrew" in docker
    assert "ghcr.io/kirodotdev" not in compose
    assert "ghcr.io/laqaer/kirocrew:stable" in compose
    assert "container_name: junction" in compose
    ec2 = (_REPO_ROOT / "src/kiro_crew/cloud/templates/kirocrew-ec2.yaml").read_text(
        encoding="utf-8"
    )
    assert "https://github.com/laqaer/acpcrew.git" in ec2
    assert "kirodotdev/KiroCrew" not in ec2
    assert "scripts/get-junction.sh" in install
    assert "minimal_install.sh" in install
    gs = (_REPO_ROOT / "src/kiro_crew/docs/getting-started.md").read_text(encoding="utf-8")
    assert "scripts/get-junction.sh" in gs
    assert "```bash\ngit clone https://github.com/laqaer/acpcrew.git" in gs
    packaged = (_REPO_ROOT / "src/kiro_crew/docs/index.md").read_text(encoding="utf-8")
    assert "A vendor agent CLI is optional" in packaged
    assert "kiro-cli is optional" not in packaged.split("## Core Capabilities", 1)[0]


def test_operator_install_script_is_junction(tmp_path: Path) -> None:
    script = _REPO_ROOT / "scripts" / "get-junction.sh"
    text = script.read_text(encoding="utf-8")
    assert text.startswith("#!/bin/sh\n")
    assert "laqaer/acpcrew" in text
    assert "minimal_install.sh" in text
    assert "Kiro Crew" not in text
    assert "KiroCrew" not in text  # brand-ok: asserting the concatenated token is absent
    assert "download.crew.kiro.dev" not in text
    assert "kirodotdev" not in text
    minimal = (_REPO_ROOT / "minimal_install.sh").read_text(encoding="utf-8")
    assert "Junction installed." in minimal
    assert "junction up" in minimal
    assert "A vendor agent CLI is optional." in minimal
    assert "👻" not in minimal
    assert "Kiro Crew" not in minimal
    assert "KiroCrew" not in minimal  # brand-ok: asserting the concatenated token is absent
    assert "kirodotdev" not in minimal
    assert "ollama pull" not in minimal
    checkout = (_REPO_ROOT / "install.sh").read_text(encoding="utf-8")
    assert "Junction installed." in checkout
    assert "junction up" in checkout
    assert "A vendor agent CLI is optional" in checkout
    assert "👻" not in checkout
    assert "Your personal AI agent" not in checkout
    assert "kiro.dev" not in checkout
    assert "kirodotdev" not in checkout
    assert "kirocrew gateway" not in checkout
    env = os.environ.copy()
    env["HOME"] = str(tmp_path)
    env["JUNCTION_SRC"] = str(tmp_path / "src")
    env["JUNCTION_BIN_DIR"] = str(tmp_path / "bin")
    result = subprocess.run(
        ["sh", str(script), "--dry-run"],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        env=env,
    )
    assert result.returncode == 0, result.stderr
    assert "repo=https://github.com/laqaer/acpcrew.git" in result.stdout
    assert f"dest={tmp_path / 'src'}" in result.stdout
    assert "installer=minimal_install.sh" in result.stdout
    assert "next: junction setup && junction up" in result.stdout
    assert list(tmp_path.iterdir()) == []


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
    assert "The product is **Junction**" in agents
    assert "kiro-cli is REQUIRED" not in agents
    assert "Kiro Crew is an open-source personal AI agent" not in agents
    assert "this is a public OSS fork" not in agents.lower()


def test_github_issue_templates_are_junction() -> None:
    config = (_REPO_ROOT / ".github" / "ISSUE_TEMPLATE" / "config.yml").read_text(encoding="utf-8")
    bug = (_REPO_ROOT / ".github" / "ISSUE_TEMPLATE" / "bug_report.yml").read_text(encoding="utf-8")
    feature = (_REPO_ROOT / ".github" / "ISSUE_TEMPLATE" / "feature_request.yml").read_text(
        encoding="utf-8"
    )
    assert "kirodotdev/KiroCrew" not in config
    assert "kirodotdev/KiroCrew" not in bug
    assert "kirodotdev/KiroCrew" not in feature
    assert "KiroCrew version" not in bug  # brand-ok: forbidden heading must stay gone
    assert "Junction version" in bug
    assert "junction --version" in bug
    assert "junction up" in bug
    docs = (_REPO_ROOT / ".github" / "ISSUE_TEMPLATE" / "documentation.yml").read_text(
        encoding="utf-8"
    )
    assert "Junction" in docs
    assert "kirodotdev/KiroCrew" not in docs
    assert "Channels help" not in docs


def test_ownership_and_banner_are_junction() -> None:
    maintainers = (_REPO_ROOT / "MAINTAINERS.md").read_text(encoding="utf-8")
    codeowners = (_REPO_ROOT / ".github" / "CODEOWNERS").read_text(encoding="utf-8")
    banner = (_REPO_ROOT / "assets" / "banner.svg").read_text(encoding="utf-8")
    notice = (_REPO_ROOT / "NOTICE").read_text(encoding="utf-8")
    assert "@laqaer" in maintainers
    assert "kirocrew-team" not in maintainers
    assert "kirodotdev/KiroCrew" not in maintainers
    assert "*                                   @laqaer" in codeowners
    assert "kirocrew-team" not in codeowners
    assert 'aria-label="Junction"' in banner
    assert "Kiro Crew" not in banner
    assert notice.lstrip().startswith("Junction")
    assert "this fork" not in notice.lower()
    wrapper = (_REPO_ROOT / "bin" / "kirocrew").read_text(encoding="utf-8")
    junction_wrapper = (_REPO_ROOT / "bin" / "junction").read_text(encoding="utf-8")
    assert wrapper == junction_wrapper
    assert "Junction virtual environment not found" in wrapper
    assert "Kiro Crew virtual environment" not in wrapper
    assert "# Junction CLI wrapper." in wrapper
