"""Compose harness + model plane status into one Junction snapshot.

The two planes already have owners (``acp.runtimes`` and ``model_router``).
This module does not spawn agents, probe non-loopback hosts, or change the
Kiro harness path. It is a read-only join so CLI, doctor, and the dashboard
share one payload instead of three overlapping status shapes.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
from collections.abc import Mapping
from pathlib import Path
from typing import Any

from aiohttp import web

from kiro_crew.acp.runtimes import (
    AUTO_PREFERENCE,
    RuntimeNotFoundError,
    builtin_specs,
    runtime_available,
    select_runtime,
)
from kiro_crew.acp.types import ACP_BACKEND_AUTO, ACP_BACKEND_KIRO
from kiro_crew.constants import CLI_BIN, PRODUCT_NAME
from kiro_crew.model_router.probe import probe_status

logger = logging.getLogger(__name__)

CODE_OK = "ok"


def runtime_label(runtime_id: str) -> str:
    """Stable JSON id. The Kiro harness is spelled ``""`` on the wire (H7)."""
    if runtime_id == ACP_BACKEND_KIRO:
        return "kiro-cli"
    return runtime_id


def harness_inventory(
    *,
    which: Any = None,
    home: Path | None = None,
    env: Mapping[str, str] | None = None,
) -> list[dict[str, Any]]:
    """Installed-or-not rows for every registry id, kiro-cli last and optional."""
    specs = builtin_specs(which=which, home=home, env=env)
    rows: list[dict[str, Any]] = []
    for runtime_id in AUTO_PREFERENCE:
        spec = specs[runtime_id]
        rows.append(
            {
                "id": runtime_label(spec.id),
                "available": runtime_available(spec, which=which, home=home, env=env),
                "protocol": spec.protocol,
                "optional": spec.id == ACP_BACKEND_KIRO,
            }
        )
    return rows


def snapshot_planes(
    *,
    which: Any = None,
    home: Path | None = None,
    env: Mapping[str, str] | None = None,
    router_port: int | None = None,
    gateway_port: int | None = None,
) -> dict[str, Any]:
    """Harness inventory + model-sidecar health. Gateway is never crashed by this."""
    inventory = harness_inventory(which=which, home=home, env=env)
    selected = ""
    try:
        spec = select_runtime(ACP_BACKEND_AUTO, which=which, home=home, env=env)
        selected = runtime_label(spec.id)
    except RuntimeNotFoundError:
        selected = ""
    model = probe_status(router_port=router_port, gateway_port=gateway_port)
    return {
        "product": PRODUCT_NAME,
        "cli": CLI_BIN,
        "harness": {
            "default": ACP_BACKEND_AUTO,
            "selected": selected,
            "kiro_cli": "optional",
            "runtimes": inventory,
        },
        "model": model.to_dict(),
        "gateway": {"status": "ok", "code": CODE_OK},
        "code": CODE_OK,
    }


def run_planes_command(args: argparse.Namespace) -> None:
    """``junction planes`` — one screen for both planes.

    Human text is the default. ``--json`` is the machine form so scripts do not
    have to peel a dump off the last line of operator copy.
    """
    snap = snapshot_planes(router_port=getattr(args, "router_port", None))
    if getattr(args, "as_json", False):
        print(json.dumps(snap, separators=(",", ":")))
        return
    harness = snap["harness"]
    model = snap["model"]
    selected = harness["selected"] or "none installed"
    print(f"{PRODUCT_NAME} planes")
    print(f"  harness: {harness['default']} (selected={selected})")
    print(f"  model:   {model['status']} (sidecar optional; gateway still works)")
    available = [row["id"] for row in harness["runtimes"] if row["available"]]
    if available:
        print(f"  docked:  {', '.join(available)}")
    print("never paste provider keys into chat; the sidecar injects them.")


async def api_planes(request: web.Request) -> web.Response:
    """GET /api/planes — composed harness + model status. Always 200."""
    payload = await asyncio.to_thread(snapshot_planes)
    logger.info(
        "planes snapshot harness_selected=%s model=%s",
        payload["harness"]["selected"],
        payload["model"]["status"],
    )
    return web.json_response(payload)
