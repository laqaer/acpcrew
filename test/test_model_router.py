"""Model-router sidecar probe: loopback only, no live providers, no secrets."""

from __future__ import annotations

import argparse
import json
import threading
from collections.abc import Iterator
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

import pytest

from kiro_crew.model_router.probe import (
    CODE_INVALID_PORT,
    CODE_OK,
    CODE_UNREACHABLE,
    probe_status,
    resolve_router_port,
)


class _HealthServer:
    def __init__(self, body: bytes) -> None:
        class _ProbeHandler(BaseHTTPRequestHandler):
            def do_GET(self) -> None:
                route = self.path.split("?", 1)[0]
                if route in ("/health", "/health/liveliness"):
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                else:
                    self.send_response(404)
                    self.end_headers()

            def log_message(self, fmt: str, *args: Any) -> None:
                return

        self._server = ThreadingHTTPServer(("127.0.0.1", 0), _ProbeHandler)
        self.port = int(self._server.server_address[1])
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    def close(self) -> None:
        self._server.shutdown()
        self._server.server_close()


@pytest.fixture
def health_server() -> Iterator[_HealthServer]:
    server = _HealthServer(b'{"ok":true,"api_key":"sk-live-secret","version":"1"}')
    try:
        yield server
    finally:
        server.close()


def test_probe_up_drops_secret_fields(health_server: _HealthServer) -> None:
    status = probe_status(router_port=health_server.port, gateway_port=health_server.port)
    assert status.reachable is True
    assert status.degraded is False
    assert status.to_dict()["status"] == "healthy"
    assert status.router.code == CODE_OK
    assert status.router.health.get("ok") is True
    assert status.router.health.get("version") == "1"
    dumped = json.dumps(status.to_dict())
    assert "sk-live-secret" not in dumped
    assert "api_key" not in dumped


def test_probe_down_is_degraded_not_an_exception() -> None:
    closer = ThreadingHTTPServer(("127.0.0.1", 0), BaseHTTPRequestHandler)
    port = int(closer.server_address[1])
    closer.server_close()
    status = probe_status(router_port=port, gateway_port=port)
    assert status.reachable is False
    assert status.degraded is True
    assert status.router.code == CODE_UNREACHABLE
    assert status.to_dict()["status"] == "unreachable"
    assert "127.0.0.1" in status.router.url


def test_invalid_port_is_coded() -> None:
    status = probe_status(router_port=0)
    assert status.reachable is False
    assert status.router.code == CODE_INVALID_PORT


def test_env_port_override(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MODEL_ROUTER_PORT", "4242")
    assert resolve_router_port() == 4242
    monkeypatch.setenv("MODEL_ROUTER_PORT", "not-a-port")
    assert resolve_router_port() == 4202


def test_cli_status_prints_json_without_secrets(
    health_server: _HealthServer, capsys: pytest.CaptureFixture[str]
) -> None:
    from kiro_crew.model_router.cli import run_router_command

    args = argparse.Namespace(router_action="status", router_port=health_server.port)
    run_router_command(args)
    out = capsys.readouterr().out
    assert "sk-live-secret" not in out
    last = out.strip().splitlines()[-1]
    payload = json.loads(last)
    assert payload["reachable"] is True
    assert payload["router"]["code"] == CODE_OK
    assert "api_key" not in json.dumps(payload)


@pytest.mark.asyncio
async def test_api_status_unreachable(monkeypatch: pytest.MonkeyPatch) -> None:
    from aiohttp.test_utils import make_mocked_request

    from kiro_crew.model_router import api
    from kiro_crew.model_router.probe import EndpointStatus, RouterStatus

    fake = RouterStatus(
        reachable=False,
        degraded=True,
        router=EndpointStatus(url="http://127.0.0.1:9/health", ok=False, code=CODE_UNREACHABLE),
        gateway=EndpointStatus(
            url="http://127.0.0.1:9/health/liveliness",
            ok=False,
            code=CODE_UNREACHABLE,
        ),
    )
    monkeypatch.setattr(api, "probe_status", lambda: fake)
    request = make_mocked_request("GET", "/api/model-router/status")
    resp = await api.api_status(request)
    assert resp.status == 200
    body = json.loads(resp.body)
    assert body["degraded"] is True
    assert body["router"]["code"] == CODE_UNREACHABLE


def test_router_is_a_listed_cli_command() -> None:
    from kiro_crew import cli_help

    assert "router" in cli_help.SUMMARIES
