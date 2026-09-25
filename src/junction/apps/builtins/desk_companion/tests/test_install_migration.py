"""Adopting an install made under the app's earlier id.

Every case here is one way an existing data home can look at the first start of a
build that uses the current id. The property all of them protect is that the user's
reminders, packs and enabled state survive, and that nothing already at the new path
is ever overwritten.
"""

from __future__ import annotations

import json
import os

import pytest

from junction.apps import manager
from junction.apps.builtins.desk_companion.appearances import (
    COLOURS_FILENAME,
    LEGACY_COLOURS_FILENAME,
)
from junction.apps.builtins.desk_companion.backend.routes import APP_NAME, LEGACY_APP_NAME
from junction.apps.builtins.desk_companion.install_migration import adopt_legacy_install
from junction.apps.builtins.desk_companion.store import (
    LEGACY_REMINDERS_FILENAME,
    REMINDERS_FILENAME,
)


def _record(*, name: str = LEGACY_APP_NAME, enabled: bool = True, source: str = "builtin"):
    """An ``installed.json`` shaped like the one earlier builds wrote."""
    return {
        "name": name,
        "version": "0.9.0",
        "displayName": "Companion",
        "enabled": enabled,
        "installedAt": "2026-01-02T03:04:05Z",
        "updatedAt": "2026-01-02T03:04:05Z",
        "source": source,
        "origin": "builtin" if source == "builtin" else "local",
        "resources": "gateway",
        "lifecycle": "locked" if source == "builtin" else "gateway",
        "schemaVersion": 2,
    }


def _legacy_install(*, enabled: bool = True, source: str = "builtin"):
    """Lay out ``apps/<legacy id>/`` with a record, a secret and user data."""
    root = manager.apps_dir() / LEGACY_APP_NAME
    data = root / "data"
    (data / "appearances" / "tabby").mkdir(parents=True)
    (data / "appearances" / "tabby" / "idle.svg").write_text("<svg>tabby</svg>", "utf-8")
    (data / LEGACY_REMINDERS_FILENAME).write_text('{"reminders_file": {}}', "utf-8")
    (data / LEGACY_COLOURS_FILENAME).write_text('{"tabby": {"#a": "#b"}}', "utf-8")
    (root / ".app_secret").write_text("secret", "utf-8")
    (root / manager.INSTALLED_META_FILENAME).write_text(
        json.dumps(_record(enabled=enabled, source=source)), "utf-8"
    )
    return root


def _read_record(root):
    return json.loads((root / manager.INSTALLED_META_FILENAME).read_text("utf-8"))


@pytest.mark.parametrize("enabled", [True, False])
def test_moves_the_install_and_keeps_the_users_data_and_choice(enabled):
    legacy = _legacy_install(enabled=enabled)
    current = manager.apps_dir() / APP_NAME

    assert adopt_legacy_install() is True

    assert not legacy.exists()
    data = current / "data"
    assert (data / REMINDERS_FILENAME).read_text("utf-8") == '{"reminders_file": {}}'
    assert (data / COLOURS_FILENAME).read_text("utf-8") == '{"tabby": {"#a": "#b"}}'
    assert not (data / LEGACY_REMINDERS_FILENAME).exists()
    assert not (data / LEGACY_COLOURS_FILENAME).exists()
    assert (data / "appearances" / "tabby" / "idle.svg").read_text("utf-8") == "<svg>tabby</svg>"
    assert (current / ".app_secret").read_text("utf-8") == "secret"

    record = _read_record(current)
    assert record["name"] == APP_NAME
    assert record["enabled"] is enabled
    assert record["installedAt"] == "2026-01-02T03:04:05Z"
    # Registration refreshes these from the shipped manifest; the stale values go.
    assert "version" not in record
    assert manager.builtin_owns_installed(APP_NAME)


@pytest.mark.parametrize(
    "gate",
    [lambda name: f"{name} is not on the allowlist", lambda name: 1 / 0],
    ids=["denied", "check-raises"],
)
def test_an_enabled_install_the_apps_policy_denies_is_adopted_disabled(monkeypatch, gate):
    """The ``apps`` policy may name only the legacy id, so the carried-over enabled
    state passes the same gate a first registration does, failing closed."""
    monkeypatch.setattr(manager, "_app_activation_denied", gate)
    _legacy_install(enabled=True)

    assert adopt_legacy_install() is True

    current = manager.apps_dir() / APP_NAME
    assert _read_record(current)["enabled"] is False
    # The data still moves: only the enabled state is withheld.
    assert (current / "data" / REMINDERS_FILENAME).is_file()


def test_a_second_run_changes_nothing():
    _legacy_install()
    assert adopt_legacy_install() is True
    current = manager.apps_dir() / APP_NAME
    before = sorted(p.relative_to(current) for p in current.rglob("*"))
    record = _read_record(current)

    assert adopt_legacy_install() is False

    assert sorted(p.relative_to(current) for p in current.rglob("*")) == before
    assert _read_record(current) == record


def test_never_overwrites_an_install_already_at_the_current_id():
    legacy = _legacy_install()
    current = manager.apps_dir() / APP_NAME
    (current / "data").mkdir(parents=True)
    (current / "data" / REMINDERS_FILENAME).write_text('{"mine": true}', "utf-8")
    (current / manager.INSTALLED_META_FILENAME).write_text(
        json.dumps(_record(name=APP_NAME, enabled=False)), "utf-8"
    )

    assert adopt_legacy_install() is False

    assert (legacy / "data" / LEGACY_REMINDERS_FILENAME).is_file()
    assert _read_record(legacy)["name"] == LEGACY_APP_NAME
    assert (current / "data" / REMINDERS_FILENAME).read_text("utf-8") == '{"mine": true}'
    assert _read_record(current)["enabled"] is False


def test_leaves_a_user_installed_app_under_the_legacy_id_alone():
    legacy = _legacy_install(source="/srv/src/their-app")

    assert adopt_legacy_install() is False

    assert _read_record(legacy)["source"] == "/srv/src/their-app"
    assert (legacy / "data" / LEGACY_REMINDERS_FILENAME).is_file()
    assert not (manager.apps_dir() / APP_NAME).exists()


def test_finishes_a_move_that_was_interrupted_before_the_renames():
    legacy = _legacy_install()
    current = manager.apps_dir() / APP_NAME
    os.rename(legacy, current)

    assert adopt_legacy_install() is False

    assert (current / "data" / REMINDERS_FILENAME).is_file()
    assert (current / "data" / COLOURS_FILENAME).is_file()
    assert _read_record(current)["name"] == APP_NAME


def test_a_data_file_already_under_its_current_name_is_kept():
    legacy = _legacy_install()
    (legacy / "data" / REMINDERS_FILENAME).write_text('{"newer": true}', "utf-8")

    adopt_legacy_install()

    data = manager.apps_dir() / APP_NAME / "data"
    assert (data / REMINDERS_FILENAME).read_text("utf-8") == '{"newer": true}'
    assert (data / LEGACY_REMINDERS_FILENAME).read_text("utf-8") == '{"reminders_file": {}}'
    # The other file had no conflict and still moves.
    assert (data / COLOURS_FILENAME).is_file()


@pytest.mark.skipif(os.name == "nt", reason="creating a symlink needs privilege on Windows")
def test_a_symlinked_legacy_dir_is_not_moved(tmp_path):
    elsewhere = tmp_path / "elsewhere"
    elsewhere.mkdir()
    (elsewhere / manager.INSTALLED_META_FILENAME).write_text(json.dumps(_record()), "utf-8")
    manager.apps_dir().mkdir(parents=True, exist_ok=True)
    link = manager.apps_dir() / LEGACY_APP_NAME
    link.symlink_to(elsewhere, target_is_directory=True)

    assert adopt_legacy_install() is False

    assert link.is_symlink()
    assert not (manager.apps_dir() / APP_NAME).exists()


def test_nothing_to_adopt_is_a_no_op():
    assert adopt_legacy_install() is False
    assert not (manager.apps_dir() / APP_NAME).exists()
