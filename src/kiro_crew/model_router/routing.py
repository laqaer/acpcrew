"""Role DAG and token-efficient model selection.

Junction routes work through named roles. Each role has a cost class so
orchestration and background stay cheap, planning spends on capability, and
execution sits in the middle — maximizing useful work per token.

Pins in ``agent.role_models`` always win. Unpinned roles resolve to ``"auto"``
unless the caller supplies an advertised id set; then the pick is the first
advertised id in that role's cost class. Concrete model ids are never hardcoded
as defaults.

Cost class is inferred from slug tokens (``flash``, ``opus``, …), never from a
pinned flagship id. An empty advertised set means entitlement is unknown, so the
wire id stays ``"auto"`` (inherit the session default).
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from typing import Any, Iterable, Mapping, Sequence

from kiro_crew.model_router.catalog import CatalogModel, load_catalog

logger = logging.getLogger(__name__)

# Task-class roles operators can pin. background/subagent already existed;
# orchestration/planning/execution are the DAG stages for a run.
ROLE_ORCHESTRATION = "orchestration"
ROLE_PLANNING = "planning"
ROLE_EXECUTION = "execution"
ROLE_BACKGROUND = "background"
ROLE_SUBAGENT = "subagent"

ROUTE_ROLE_KEYS: tuple[str, ...] = (
    ROLE_ORCHESTRATION,
    ROLE_PLANNING,
    ROLE_EXECUTION,
    ROLE_BACKGROUND,
    ROLE_SUBAGENT,
)

COST_ECONOMY = "economy"
COST_STANDARD = "standard"
COST_CAPABLE = "capable"
COST_CLASSES: tuple[str, ...] = (COST_ECONOMY, COST_STANDARD, COST_CAPABLE)

# Cheapest class that still does the job. Orchestration is control traffic;
# planning is rare and high-leverage; execution is the bulk of coding tokens.
ROLE_COST_CLASS: dict[str, str] = {
    ROLE_ORCHESTRATION: COST_ECONOMY,
    ROLE_PLANNING: COST_CAPABLE,
    ROLE_EXECUTION: COST_STANDARD,
    ROLE_BACKGROUND: COST_ECONOMY,
    ROLE_SUBAGENT: COST_STANDARD,
}

# Directed edges: orchestration fans into planning, planning into execution,
# execution may fan out to subagents. background is a side node (heartbeat),
# not on the run path.
ROLE_DAG_EDGES: tuple[tuple[str, str], ...] = (
    (ROLE_ORCHESTRATION, ROLE_PLANNING),
    (ROLE_PLANNING, ROLE_EXECUTION),
    (ROLE_EXECUTION, ROLE_SUBAGENT),
)

# Token sets on the leaf (after the last ``/``). ``mini`` is omitted because it
# false-hits MiniMax. ``pro`` is a whole token so ``contributor`` stays standard.
_TOKEN_SPLIT = re.compile(r"[^a-z0-9]+")
_ECONOMY_TOKENS = frozenset(
    {"flash", "turbo", "haiku", "highspeed", "free", "tiny", "lite", "nano"}
)
_CAPABLE_TOKENS = frozenset({"opus", "pro", "max", "ultra", "fable", "k3", "sol", "terra"})
_CAPABLE_LEAVES = frozenset({"grok-4.5", "grok-4.6", "kimi-k3", "k3"})

DEFAULT_MODEL = "auto"


@dataclass(frozen=True, slots=True)
class RoleAssignment:
    """One role's pin, cost class, wire id, and catalog suggestion."""

    role: str
    cost_class: str
    pin: str
    wire_id: str
    suggestion: str
    reason: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "role": self.role,
            "cost_class": self.cost_class,
            "pin": self.pin,
            "wire_id": self.wire_id,
            "suggestion": self.suggestion,
            "reason": self.reason,
        }


@dataclass(frozen=True, slots=True)
class RoutingPlan:
    """Full DAG with per-role assignments."""

    roles: tuple[RoleAssignment, ...]
    edges: tuple[tuple[str, str], ...]

    def to_dict(self) -> dict[str, Any]:
        return {
            "roles": [row.to_dict() for row in self.roles],
            "dag": [{"from": src, "to": dst} for src, dst in self.edges],
            "code": "ok",
        }

    def assignment(self, role: str) -> RoleAssignment | None:
        for row in self.roles:
            if row.role == role:
                return row
        return None


def classify_cost(model_id: str) -> str:
    """Map a slug or advertised id onto a cost class. Default is standard."""
    raw = (model_id or "").strip().lower()
    if not raw:
        return COST_STANDARD
    leaf = raw.rsplit("/", 1)[-1]
    if leaf in _CAPABLE_LEAVES or raw in _CAPABLE_LEAVES:
        return COST_CAPABLE
    tokens = {tok for tok in _TOKEN_SPLIT.split(leaf) if tok}
    if tokens & _ECONOMY_TOKENS or leaf.endswith("-free") or leaf.endswith(":free"):
        return COST_ECONOMY
    if tokens & _CAPABLE_TOKENS:
        return COST_CAPABLE
    return COST_STANDARD


def annotated_catalog() -> dict[str, Any]:
    """Catalog JSON with a cost_class on every model row.

    The snapshot stays free of baked-in class labels so a token-set change
    reclassifies without rewriting catalog.json.
    """
    payload = load_catalog().to_dict()
    for row in payload["models"]:
        row["cost_class"] = classify_cost(str(row.get("slug") or ""))
    return payload


def build_plan(
    *,
    pins: Mapping[str, str] | None = None,
    advertised: Sequence[str] | None = None,
) -> RoutingPlan:
    """Build the role DAG. Pins win; advertised ids bound the wire pick."""
    pin_map = {key: (pins.get(key) or "").strip() for key in ROUTE_ROLE_KEYS} if pins else {}
    advertised_ids = _clean_ids(advertised)
    catalog = load_catalog()
    listed = tuple(row for row in catalog.models if row.listed)
    roles: list[RoleAssignment] = []
    for role in ROUTE_ROLE_KEYS:
        cost = ROLE_COST_CLASS[role]
        pin = pin_map.get(role, "")
        suggestion = _suggest_catalog_slug(cost, listed)
        if pin:
            wire = pin
            reason = "operator pin"
        elif advertised_ids:
            wire = _pick_advertised(cost, advertised_ids)
            reason = (
                "advertised cost-class match"
                if wire != DEFAULT_MODEL
                else "no advertised id in cost class; inherit"
            )
        else:
            wire = DEFAULT_MODEL
            reason = "no advertised set; inherit session default"
        roles.append(
            RoleAssignment(
                role=role,
                cost_class=cost,
                pin=pin,
                wire_id=wire or DEFAULT_MODEL,
                suggestion=suggestion,
                reason=reason,
            )
        )
    return RoutingPlan(roles=tuple(roles), edges=ROLE_DAG_EDGES)


def resolve_wire_id(
    role: str,
    *,
    pins: Mapping[str, str] | None = None,
    advertised: Sequence[str] | None = None,
) -> str:
    """Id to send on the wire for *role*, or ``auto`` to inherit."""
    plan = build_plan(pins=pins, advertised=advertised)
    row = plan.assignment(role)
    if row is None:
        return DEFAULT_MODEL
    return row.wire_id or DEFAULT_MODEL


async def apply_role_model(client: Any, role: str) -> str:
    """Best-effort ``set_model`` for a task-class role. Never raises."""
    if role not in ROUTE_ROLE_KEYS:
        return DEFAULT_MODEL
    pins = _load_pins()
    advertised = _advertised_from_client(client)
    wire = resolve_wire_id(role, pins=pins, advertised=advertised)
    if not wire or wire == DEFAULT_MODEL:
        return DEFAULT_MODEL
    setter = getattr(client, "set_model", None)
    if setter is None:
        return DEFAULT_MODEL
    try:
        await setter(wire)
    except Exception:
        logger.info("model-router role %s apply skipped", role)
        return DEFAULT_MODEL
    return wire


def _load_pins() -> dict[str, str]:
    try:
        from kiro_crew.config.loader import KiroCrewConfig

        return dict(KiroCrewConfig.load().agent.role_models)
    except Exception:
        return {}


def _advertised_from_client(client: Any) -> list[str]:
    handle = getattr(client, "_handle", None)
    entries = getattr(client, "available_models", None)
    if entries is None and handle is not None:
        entries = getattr(handle, "available_models", None)
    if not entries:
        return []
    try:
        from kiro_crew.acp.client import advertised_model_ids

        return advertised_model_ids(entries)
    except Exception:
        return []


def _clean_ids(raw: Sequence[str] | None) -> list[str]:
    if not raw:
        return []
    out: list[str] = []
    seen: set[str] = set()
    for item in raw:
        if not isinstance(item, str):
            continue
        value = item.strip()
        if not value or value == DEFAULT_MODEL or value in seen:
            continue
        seen.add(value)
        out.append(value)
    return out


def _pick_advertised(cost_class: str, advertised: Sequence[str]) -> str:
    matched = [item for item in advertised if classify_cost(item) == cost_class]
    if not matched:
        return DEFAULT_MODEL
    return sorted(matched)[0]


def _suggest_catalog_slug(cost_class: str, listed: Iterable[CatalogModel]) -> str:
    matched = [row for row in listed if classify_cost(row.slug) == cost_class]
    if not matched:
        return ""
    matched.sort(key=lambda row: (-row.priority, row.slug))
    return matched[0].slug
