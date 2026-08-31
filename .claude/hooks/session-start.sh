#!/bin/bash
# Ensures all Master Hub skills are present in ~/.claude/skills/ on every
# session start, regardless of how fresh the cloud container is.
#
# Safe to run by hand:  bash MasterHub/.claude/hooks/session-start.sh
# Force a re-clone:     FORCE_SYNC=1 bash MasterHub/.claude/hooks/session-start.sh
set -uo pipefail

# Locate the repo root from this script, NOT from $CLAUDE_PROJECT_DIR: when more
# than one repo is cloned into the workspace, CLAUDE_PROJECT_DIR points at the
# parent directory and the old path resolution silently found nothing.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
FORCE_SYNC="${FORCE_SYNC:-0}"
mkdir -p "$SKILLS_DIR"

install_skill_dir() {
  # $1 = source dir (must contain SKILL.md), $2 = target name
  local src="$1" name="$2"
  if [ -f "$src/SKILL.md" ]; then
    rm -rf "$SKILLS_DIR/$name"
    cp -r "$src" "$SKILLS_DIR/$name"
  fi
}

clone_bundle() {
  # $1 = git url, $2 = target name for the bundle root, $3 = optional subdir
  # holding the individual skills ("" = bundle root itself)
  local url="$1" name="$2" subdir="${3:-}"
  # Marker file, not the bundle's own SKILL.md: some bundles (marketing) have no
  # SKILL.md at their root, so keying off it would re-clone on every session.
  local marker="$SKILLS_DIR/.masterhub-$name.synced"
  if [ "$FORCE_SYNC" != "1" ] && [ -f "$marker" ]; then
    echo "  $name: already installed (set FORCE_SYNC=1 to refresh)"
    return 0
  fi
  local tmp
  tmp=$(mktemp -d)
  if git clone --depth 1 -q "$url" "$tmp" 2>/dev/null; then
    install_skill_dir "$tmp" "$name"
    local search="$tmp"
    [ -n "$subdir" ] && [ -d "$tmp/$subdir" ] && search="$tmp/$subdir"
    for d in "$search"/*/; do
      [ -d "$d" ] || continue
      install_skill_dir "${d%/}" "$(basename "$d")"
    done
    date -u +%Y-%m-%dT%H:%M:%SZ > "$marker"
    echo "  $name: synced from $url"
  else
    echo "  $name: CLONE FAILED ($url) — skills unavailable this session" >&2
  fi
  rm -rf "$tmp"
}

echo "Master Hub: syncing skills from $REPO_ROOT"

# 1. Skills committed directly in this repo (e.g. impeccable)
if [ -d "$REPO_ROOT/.claude/skills" ]; then
  for d in "$REPO_ROOT"/.claude/skills/*/; do
    [ -d "$d" ] || continue
    install_skill_dir "${d%/}" "$(basename "$d")"
    echo "  $(basename "$d"): installed from repo"
  done
fi

# 2. gstack — AI engineering toolkit
clone_bundle https://github.com/garrytan/gstack.git gstack

# 3. marketing skills
clone_bundle https://github.com/coreyhaines31/marketingskills.git marketing skills

# Verify the two skills every Master Hub session depends on.
missing=0
for required in gstack impeccable; do
  if [ -f "$SKILLS_DIR/$required/SKILL.md" ]; then
    echo "  OK: $required"
  else
    echo "  MISSING: $required" >&2
    missing=1
  fi
done

echo "Master Hub: $(ls -1 "$SKILLS_DIR" | wc -l) skills in $SKILLS_DIR"
exit $missing
