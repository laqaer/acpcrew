"""Dashboard JSON for the optional model-router sidecar."""

from __future__ import annotations

import asyncio
import logging

from aiohttp import web

from kiro_crew.model_router.probe import probe_status

logger = logging.getLogger(__name__)


async def api_status(request: web.Request) -> web.Response:
    """GET /api/model-router/status — sidecar health. Always loopback."""
    status = await asyncio.to_thread(probe_status)
    payload = status.to_dict()
    # Unreachable sidecar is degraded, not a request error. 200 lets the UI
    # render "optional plane down" without treating it as an API failure.
    logger.info("model-router status reachable=%s", status.reachable)
    return web.json_response(payload)
