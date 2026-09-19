"""``junction router`` — operator-facing sidecar status."""

from __future__ import annotations

import argparse
import json
import sys

from kiro_crew.model_router.probe import RouterStatus, probe_status


def run_router_command(args: argparse.Namespace) -> None:
    action = getattr(args, "router_action", None) or "status"
    if action != "status":
        print(f"unknown router action: {action}", file=sys.stderr)
        raise SystemExit(2)
    status = probe_status(router_port=getattr(args, "router_port", None))
    _print_status(status)


def _print_status(status: RouterStatus) -> None:
    plane = status.plane_status
    note = ""
    if plane != "healthy":
        note = " (ACP gateway still works)"
    print(f"model-router sidecar: {plane}{note}")
    print(f"  router:  {status.router.url}  {status.router.code}")
    print(f"  gateway: {status.gateway.url}  {status.gateway.code}")
    print("never paste provider keys into chat; the sidecar injects them.")
    print(json.dumps(status.to_dict(), separators=(",", ":")))
