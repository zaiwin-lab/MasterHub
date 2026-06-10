#!/bin/bash
# Ensures all Master Hub skills are present in ~/.claude/skills/ on every
# session start, regardless of how fresh the cloud container is.
set -uo pipefail

SKILLS_DIR="$HOME/.claude/skills"
mkdir -p "$SKILLS_DIR"

install_skill_dir() {
  # $1 = source dir (must contain SKILL.md), $2 = target name
  local src="$1" name="$2"
  if [ -f "$src/SKILL.md" ]; then
    rm -rf "$SKILLS_DIR/$name"
    cp -r "$src" "$SKILLS_DIR/$name"
  fi
}

# 1. Skills committed directly in this repo (e.g. impeccable)
if [ -d "$CLAUDE_PROJECT_DIR/.claude/skills" ]; then
  for d in "$CLAUDE_PROJECT_DIR"/.claude/skills/*/; do
    [ -d "$d" ] || continue
    install_skill_dir "${d%/}" "$(basename "$d")"
  done
fi

# 2. gstack — AI engineering toolkit (https://github.com/garrytan/gstack)
TMP_GSTACK=$(mktemp -d)
if git clone --depth 1 -q https://github.com/garrytan/gstack.git "$TMP_GSTACK" 2>/dev/null; then
  install_skill_dir "$TMP_GSTACK" "gstack"
  for d in "$TMP_GSTACK"/*/; do
    [ -d "$d" ] || continue
    install_skill_dir "${d%/}" "$(basename "$d")"
  done
fi
rm -rf "$TMP_GSTACK"

# 3. marketing skills (https://github.com/coreyhaines31/marketingskills)
TMP_MKT=$(mktemp -d)
if git clone --depth 1 -q https://github.com/coreyhaines31/marketingskills.git "$TMP_MKT" 2>/dev/null; then
  install_skill_dir "$TMP_MKT" "marketing"
  if [ -d "$TMP_MKT/skills" ]; then
    for d in "$TMP_MKT"/skills/*/; do
      [ -d "$d" ] || continue
      install_skill_dir "${d%/}" "$(basename "$d")"
    done
  fi
fi
rm -rf "$TMP_MKT"

echo "Master Hub: synced $(ls -1 "$SKILLS_DIR" | wc -l) skills into $SKILLS_DIR"
