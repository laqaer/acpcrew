"""Observe an optional Codex Router sidecar. Do not vendor or start it.

Junction's model plane is a loopback HTTP router (typically ``:4202``) plus a
LiteLLM gateway (typically ``:4200``). This package probes health and reports
status. It never copies credentials, never logs secret-bearing bodies, and
never binds a non-loopback host. If the sidecar is absent, the ACP gateway
still runs — that is a documented degraded mode, not a hard failure.
"""

from __future__ import annotations

from kiro_crew.model_router.probe import (
    DEFAULT_GATEWAY_PORT,
    DEFAULT_ROUTER_PORT,
    HEALTH_PATH,
    LOOPBACK_HOST,
    PROBE_TIMEOUT_SECS,
    RouterStatus,
    probe_status,
)

__all__ = [
    "DEFAULT_GATEWAY_PORT",
    "DEFAULT_ROUTER_PORT",
    "HEALTH_PATH",
    "LOOPBACK_HOST",
    "PROBE_TIMEOUT_SECS",
    "RouterStatus",
    "probe_status",
]
