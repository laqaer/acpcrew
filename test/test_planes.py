"""Composed harness + model plane snapshot."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import pytest

from kiro_crew.acp.types import ACP_BACKEND_AUTO, ACP_BACKEND_CURSOR
from kiro_crew.cli_doctor import _doctor, _doctor_planes
from kiro_crew.constants import CLI_BIN, PRODUCT_NAME
from kiro_crew.planes import api_planes, harness_inventory, run_planes_command, snapshot_planes


def test_harness_inventory_marks_kiro_optional() -> None:
    rows = harness_inventory(which=lambda _name: None, home=Path("/tmp"))
    labels = [row["id"] for row in rows]
    assert labels[-1] == "kiro-cli"
    kiro = rows[-1]
    assert kiro["optional"] is True
    assert kiro["available"] is False
    assert ACP_BACKEND_CURSOR in labels


def test_snapshot_degrades_when_nothing_is_installed() -> None:
    snap = snapshot_planes(
        which=lambda _name: None, home=Path("/tmp"), router_port=9, gateway_port=9
    )
    assert snap["product"] == PRODUCT_NAME
    assert snap["cli"] == CLI_BIN
    assert snap["harness"]["default"] == ACP_BACKEND_AUTO
    assert snap["harness"]["selected"] == ""
    assert "kiro_cli" not in snap["harness"]
    assert snap["model"]["status"] == "unreachable"
    assert snap["gateway"]["status"] == "ok"
    assert snap["code"] == "ok"
    roles = {row["role"]: row["cost_class"] for row in snap["roles"]["roles"]}
    assert roles["orchestration"] == "economy"
    assert roles["planning"] == "capable"
    assert roles["execution"] == "standard"


def test_cli_planes_prints_human_copy_by_default(capsys: pytest.CaptureFixture[str]) -> None:
    args = argparse.Namespace(router_port=9, as_json=False)
    run_planes_command(args)
    out = capsys.readouterr().out
    assert "Junction planes" in out
    assert "never paste provider keys" in out
    assert "orchestration=economy" in out
    last = out.strip().splitlines()[-1]
    with pytest.raises(json.JSONDecodeError):
        json.loads(last)


def test_cli_planes_json_flag_is_machine_only(capsys: pytest.CaptureFixture[str]) -> None:
    args = argparse.Namespace(router_port=9, as_json=True)
    run_planes_command(args)
    out = capsys.readouterr().out
    assert "Junction planes" not in out
    payload = json.loads(out.strip())
    assert payload["cli"] == "junction"
    assert "kiro_cli" not in payload["harness"]
    assert payload["roles"]["code"] == "ok"


def test_doctor_planes_never_fails(capsys: pytest.CaptureFixture[str]) -> None:
    _doctor_planes()
    out = capsys.readouterr().out
    assert "Planes" in out
    assert "kiro-cli optional" in out
    assert "sidecar optional" in out
    assert "orchestration=economy" in out
    assert "never paste provider keys" in out


def test_doctor_quick_skips_the_full_probe(capsys: pytest.CaptureFixture[str]) -> None:
    _doctor(quick=True)
    out = capsys.readouterr().out
    assert "Quick compose" in out
    assert "Planes" in out
    assert "Platform" not in out
    assert "Dependencies" not in out
    assert "junction doctor" in out


@pytest.mark.asyncio
async def test_api_planes_always_200() -> None:
    from aiohttp.test_utils import make_mocked_request

    request = make_mocked_request("GET", "/api/planes")
    resp = await api_planes(request)
    assert resp.status == 200
    payload = json.loads(resp.body.decode())
    assert payload["cli"] == CLI_BIN
    assert payload["code"] == "ok"
    assert payload["gateway"]["status"] == "ok"
    assert "roles" in payload
    assert "kiro_cli" not in payload["harness"]
