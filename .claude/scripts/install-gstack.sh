#!/usr/bin/env bash
#
# install-gstack.sh — install the gstack AI Engineering toolkit into this session.
#
# gstack is ~1.6 GB once built (node_modules + compiled binaries), so it is NOT
# committed to this repo. Run this script whenever you want gstack's skills
# (/office-hours, /qa, /review, /ship, /cso, /browse, ...) in a session.
#
# Usage:
#   bash .claude/scripts/install-gstack.sh
#
# Idempotent: if gstack is already installed it just refreshes it.

set -euo pipefail

GSTACK_DIR="$HOME/.claude/skills/gstack"
GSTACK_REPO="https://github.com/garrytan/gstack.git"

echo "→ gstack install target: $GSTACK_DIR"

if ! command -v bun >/dev/null 2>&1; then
  echo "ERROR: 'bun' is required to build gstack but was not found on PATH." >&2
  echo "Install bun (https://bun.sh) and re-run this script." >&2
  exit 1
fi

if [ -d "$GSTACK_DIR/.git" ]; then
  echo "→ gstack already cloned — pulling latest..."
  git -C "$GSTACK_DIR" pull --ff-only || echo "  (pull skipped/failed; continuing with existing checkout)"
else
  echo "→ Cloning gstack..."
  rm -rf "$GSTACK_DIR"
  git clone --depth 1 "$GSTACK_REPO" "$GSTACK_DIR"
fi

echo "→ Running gstack setup (builds browser binary + registers skills)..."
( cd "$GSTACK_DIR" && ./setup )

echo "✓ gstack ready. Try /office-hours, /qa, or /review."
