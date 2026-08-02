#!/bin/bash
# Ensures all Master Hub skills are present in ~/.claude/skills/ on every
# session start, regardless of how fresh the cloud container is.
#
# Safe to run by hand at any time:
#   bash MasterHub/.claude/hooks/session-start.sh          # skip sources already installed
#   bash MasterHub/.claude/hooks/session-start.sh --force   # re-clone and overwrite everything
set -uo pipefail

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

# Locate the repo root from this script's own path so the hook works even when
# CLAUDE_PROJECT_DIR points somewhere else — in multi-repo cloud sessions the
# project dir is the parent of all cloned repos, not this repo.
REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)

SKILLS_DIR="$HOME/.claude/skills"
mkdir -p "$SKILLS_DIR"

installed=0
failed=()

install_skill_dir() {
  # $1 = source dir (must contain SKILL.md), $2 = target name
  local src="$1" name="$2"
  if [ -f "$src/SKILL.md" ]; then
    rm -rf "${SKILLS_DIR:?}/$name"
    cp -r "$src" "$SKILLS_DIR/$name"
    installed=$((installed + 1))
  fi
}

# Already present, and not forcing a refresh? Nothing to clone.
have_skill() {
  [ "$FORCE" -eq 0 ] && [ -f "$SKILLS_DIR/$1/SKILL.md" ]
}

# 1. Skills committed directly in this repo (e.g. impeccable).
#    Always re-copied — the repo is the source of truth for these.
if [ -d "$REPO_ROOT/.claude/skills" ]; then
  for d in "$REPO_ROOT"/.claude/skills/*/; do
    [ -d "$d" ] || continue
    install_skill_dir "${d%/}" "$(basename "$d")"
  done
fi

# 2. gstack — AI engineering toolkit (https://github.com/garrytan/gstack)
if have_skill gstack; then
  echo "Master Hub: gstack already installed (use --force to refresh)" >&2
else
  TMP_GSTACK=$(mktemp -d)
  if git clone --depth 1 -q https://github.com/garrytan/gstack.git "$TMP_GSTACK"; then
    rm -rf "$TMP_GSTACK/.git"
    install_skill_dir "$TMP_GSTACK" "gstack"
    for d in "$TMP_GSTACK"/*/; do
      [ -d "$d" ] || continue
      install_skill_dir "${d%/}" "$(basename "$d")"
    done
  else
    failed+=("gstack")
  fi
  rm -rf "$TMP_GSTACK"
fi

# 3. marketing skills (https://github.com/coreyhaines31/marketingskills)
if have_skill copywriting; then
  echo "Master Hub: marketing skills already installed (use --force to refresh)" >&2
else
  TMP_MKT=$(mktemp -d)
  if git clone --depth 1 -q https://github.com/coreyhaines31/marketingskills.git "$TMP_MKT"; then
    rm -rf "$TMP_MKT/.git"
    install_skill_dir "$TMP_MKT" "marketing"
    if [ -d "$TMP_MKT/skills" ]; then
      for d in "$TMP_MKT"/skills/*/; do
        [ -d "$d" ] || continue
        install_skill_dir "${d%/}" "$(basename "$d")"
      done
    fi
  else
    failed+=("marketing")
  fi
  rm -rf "$TMP_MKT"
fi

if [ ${#failed[@]} -gt 0 ]; then
  # Surface the failure instead of swallowing it — a silent skip is what made
  # a missing gstack look like a working install.
  echo "Master Hub: FAILED to fetch: ${failed[*]} (network/proxy?)" >&2
fi

echo "Master Hub: $installed skill dirs written; $(ls -1 "$SKILLS_DIR" | wc -l) skills now in $SKILLS_DIR"

# Never block session start on a skills-sync failure.
exit 0
