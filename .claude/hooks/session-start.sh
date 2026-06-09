#!/bin/bash
# Auto-installs all MasterHub skills to ~/.claude/skills/ on every session start

MASTERHUB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SKILLS_SRC="$MASTERHUB_DIR/.claude/skills"
SKILLS_DEST="$HOME/.claude/skills"

mkdir -p "$SKILLS_DEST"

for skill_dir in "$SKILLS_SRC"/*/; do
  skill_name=$(basename "$skill_dir")
  if [ ! -d "$SKILLS_DEST/$skill_name" ]; then
    cp -r "$skill_dir" "$SKILLS_DEST/$skill_name"
    echo "[MasterHub] Installed skill: $skill_name"
  else
    echo "[MasterHub] Skill already present: $skill_name"
  fi
done

echo "[MasterHub] Skills ready."
