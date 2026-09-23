#!/bin/bash
# Copy the Junction data home into .kirocrew-dev/ for local development.
# Safe to re-run — wipes .kirocrew-dev first so you get a clean snapshot.
#
# Usage: ./dev-seed.sh
set -e

# Prefer the live data home: an explicit JUNCTION_HOME, then ~/.junction,
# then an older directory this checkout still keeps.
if [ -n "${JUNCTION_HOME:-}" ] && [ -d "$JUNCTION_HOME" ]; then
  SRC="$JUNCTION_HOME"
elif [ -d "$HOME/.junction" ]; then
  SRC="$HOME/.junction"
elif [ -d "$HOME/.kiro/crew" ]; then
  SRC="$HOME/.kiro/crew"
elif [ -d "$HOME/.kirocrew" ]; then
  SRC="$HOME/.kirocrew"
else
  SRC=""
fi
DST="$(cd "$(dirname "$0")" && pwd)/.kirocrew-dev"

if [ -z "$SRC" ]; then
  echo "No Junction data home found — nothing to seed."
  exit 0
fi

if [ -d "$DST" ]; then
  # Refuse to rm -rf if .kirocrew-dev is a symlink (could follow to unrelated dir)
  if [ -L "$DST" ]; then
    echo "ERROR: .kirocrew-dev is a symlink — refusing to remove. Delete it manually."
    exit 1
  fi
  echo "Removing existing .kirocrew-dev/ ..."
  rm -rf "$DST"
fi

echo "Copying $SRC → .kirocrew-dev/ ..."
cp -R "$SRC" "$DST"

echo "Done. Start the gateway with:"
echo "  JUNCTION_HOME=.kirocrew-dev bin/junction gateway"
