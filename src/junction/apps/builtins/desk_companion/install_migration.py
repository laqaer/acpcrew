"""Adopt an install made under the app's earlier id.

Earlier Junction builds installed this app under :data:`LEGACY_APP_NAME`, so an
existing data home keeps the user's reminders, break settings, stats, custom
appearance packs and enabled state in ``apps/<LEGACY_APP_NAME>/``. Builtin
registration looks only under :data:`APP_NAME`: without this step it would create
an empty, disabled install beside the old one and list the old directory as an
orphan.

:func:`adopt_legacy_install` runs from ``register_builtin_apps()`` BEFORE any
builtin registers. It is idempotent and never overwrites anything:

* The legacy directory moves to :data:`APP_NAME` in one ``os.rename``, and only when
  it is a real directory whose ``installed.json`` a builtin wrote, and nothing exists
  at the new path. When both exist, both are left as they are and the conflict is
  logged, so the user can choose.
* Inside the adopted ``data/``, the files earlier builds named after the old id take
  their current names, again only when the current name is free.
* The stale ``installed.json`` (old id, old version) is replaced by a record that
  carries only what belongs to the user: whether the app was enabled, and when it
  was installed. Registration then refreshes everything else from the shipped
  manifest and keeps that enabled state instead of applying ``defaultEnabled``.
  The carried-over state passes the same ``apps`` activation gate a first
  registration applies, because the ``apps`` policy may not name the current id:
  an app the policy denies, or one whose check fails, registers disabled.

The last two steps check the current directory on every boot, so a start that is
interrupted between the move and the renames finishes on the next one.
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path

from junction.apps import manager as app_manager
from junction.apps.builtins.desk_companion.appearances import (
    COLOURS_FILENAME,
    LEGACY_COLOURS_FILENAME,
)
from junction.apps.builtins.desk_companion.backend.routes import APP_NAME, LEGACY_APP_NAME
from junction.apps.builtins.desk_companion.store import (
    LEGACY_REMINDERS_FILENAME,
    REMINDERS_FILENAME,
)
from junction.atomic_write import atomic_write
from junction.platform_compat import is_link_or_junction

logger = logging.getLogger(__name__)

#: Data files named after the legacy id, paired with their current names.
_LEGACY_DATA_FILES: tuple[tuple[str, str], ...] = (
    (LEGACY_REMINDERS_FILENAME, REMINDERS_FILENAME),
    (LEGACY_COLOURS_FILENAME, COLOURS_FILENAME),
)


def adopt_legacy_install() -> bool:
    """Move the install made under :data:`LEGACY_APP_NAME` to :data:`APP_NAME`.

    Returns True when this call moved the directory. A filesystem error is logged
    and leaves every file where it was: the old install stays recoverable, and
    registration carries on.
    """
    # Resolved through the module at call time, so this always agrees with the root
    # the manager's own helpers (builtin_owns_installed, app_dir) resolve.
    root = app_manager.apps_dir()
    legacy = root / LEGACY_APP_NAME
    current = root / APP_NAME
    moved = False
    if _is_plain_dir(legacy):
        if not app_manager.builtin_owns_installed(LEGACY_APP_NAME):
            # A user-installed app that happens to use the old id is theirs to keep.
            logger.info("desk-companion: leaving %s in place: not a builtin install", legacy)
        elif os.path.lexists(current):
            logger.warning(
                "desk-companion: both %s and %s exist; using %s and leaving %s untouched",
                legacy,
                current,
                current,
                legacy,
            )
        else:
            try:
                os.rename(legacy, current)
            except OSError as exc:
                logger.warning("desk-companion: could not move %s to %s: %s", legacy, current, exc)
            else:
                moved = True
                logger.info("desk-companion: moved %s to %s", legacy, current)
    if _is_plain_dir(current):
        _rename_legacy_data_files(current / "data")
        _replace_stale_record(current)
    return moved


def _is_plain_dir(path: Path) -> bool:
    """A real directory: a link or junction is never moved or written through."""
    return path.is_dir() and not is_link_or_junction(path)


def _rename_legacy_data_files(data_dir: Path) -> None:
    """Give each data file named after the legacy id its current name, if free."""
    if not _is_plain_dir(data_dir):
        return
    for legacy_name, name in _LEGACY_DATA_FILES:
        legacy = data_dir / legacy_name
        target = data_dir / name
        if not legacy.is_file():
            continue
        if os.path.lexists(target):
            logger.warning(
                "desk-companion: both %s and %s exist; using %s and leaving %s untouched",
                legacy,
                target,
                target,
                legacy,
            )
            continue
        try:
            os.rename(legacy, target)
        except OSError as exc:
            logger.warning("desk-companion: could not rename %s to %s: %s", legacy, target, exc)


def _activation_permitted() -> bool:
    """Whether governance lets the app run under its current id.

    A failed check counts as a denial: the user can re-enable the app, which runs
    the full enable gate, whereas an app enabled past a policy that forbids it
    stays enabled until someone notices.
    """
    try:
        denied = app_manager._app_activation_denied(APP_NAME)
    except Exception as exc:  # noqa: BLE001 -- see docstring
        denied = f"governance check failed: {exc}"
    if denied:
        logger.warning("desk-companion: adopting the earlier install disabled: %s", denied)
        return False
    return True


def _replace_stale_record(app_root: Path) -> None:
    """Swap a builtin record still naming the legacy id for one naming the current id.

    Only the user's own facts carry over (enabled state, install time); version,
    display name and provenance are rewritten by registration from the shipped
    manifest. A record that already names the current id, or one a builtin did not
    write, is left alone.
    """
    record_path = app_root / app_manager.INSTALLED_META_FILENAME
    try:
        raw = json.loads(record_path.read_text("utf-8"))
    except (OSError, ValueError):
        return
    if not isinstance(raw, dict) or raw.get("name") != LEGACY_APP_NAME:
        return
    if not app_manager.builtin_owns_installed(APP_NAME):
        return
    stale = app_manager.InstalledApp.from_dict(raw)
    fresh = app_manager.InstalledApp(
        name=APP_NAME,
        enabled=stale.enabled and _activation_permitted(),
        installedAt=stale.installedAt,
        source="builtin",
        origin="builtin",
        resources="gateway",
        lifecycle="locked",
    )
    try:
        atomic_write(record_path, json.dumps(fresh.to_dict(), indent=2) + "\n")
    except OSError as exc:
        logger.warning("desk-companion: could not rewrite %s: %s", record_path, exc)
