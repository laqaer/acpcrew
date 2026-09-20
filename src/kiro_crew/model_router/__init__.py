"""Observe an optional Codex Router sidecar. Do not vendor or start it.

Junction's model plane is a loopback HTTP router (typically ``:4202``) plus a
LiteLLM gateway (typically ``:4200``). This package probes health, ships the
namespaced model-choice catalog, and plans role routing. It never copies
credentials, never logs secret-bearing bodies, and never binds a non-loopback
host. If the sidecar is absent, the ACP gateway still runs — that is a
documented degraded mode, not a hard failure.
"""

from __future__ import annotations

from kiro_crew.model_router.catalog import (
    MODEL_ID_MAX_LEN,
    MODEL_ID_PATTERN,
    load_catalog,
)
from kiro_crew.model_router.probe import (
    DEFAULT_GATEWAY_PORT,
    DEFAULT_ROUTER_PORT,
    HEALTH_PATH,
    LOOPBACK_HOST,
    PROBE_TIMEOUT_SECS,
    RouterStatus,
    probe_status,
)
from kiro_crew.model_router.routing import (
    ROLE_DAG_EDGES,
    ROUTE_ROLE_KEYS,
    annotated_catalog,
    apply_role_model,
    build_plan,
    classify_cost,
    resolve_wire_id,
)

__all__ = [
    "DEFAULT_GATEWAY_PORT",
    "DEFAULT_ROUTER_PORT",
    "HEALTH_PATH",
    "LOOPBACK_HOST",
    "MODEL_ID_MAX_LEN",
    "MODEL_ID_PATTERN",
    "PROBE_TIMEOUT_SECS",
    "ROLE_DAG_EDGES",
    "ROUTE_ROLE_KEYS",
    "RouterStatus",
    "annotated_catalog",
    "apply_role_model",
    "build_plan",
    "classify_cost",
    "load_catalog",
    "probe_status",
    "resolve_wire_id",
]
