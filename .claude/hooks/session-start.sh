#!/bin/bash
# Ensures all Master Hub skills are present in ~/.claude/skills/ on every
# session start, regardless of how fresh the cloud container is.
#
# This script locates the repo from its own path rather than trusting
# $CLAUDE_PROJECT_DIR, which is unset (or points at a parent workspace
# directory) when several repos are cloned side by side in a cloud session.
set -uo pipefail

SKILLS_DIR="$HOME/.claude/skills"
HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$HOOK_DIR/../.." && pwd)"
mkdir -p "$SKILLS_DIR"

installed=0
missing=()

install_skill_dir() {
  # $1 = source dir (must contain SKILL.md), $2 = target name
  local src="$1" name="$2"
  if [ -f "$src/SKILL.md" ]; then
    rm -rf "$SKILLS_DIR/$name"
    cp -r "$src" "$SKILLS_DIR/$name"
    installed=$((installed + 1))
    return 0
  fi
  return 1
}

install_pack() {
  # $1 = pack name, $2 = git URL, $3 = subdir holding the skills ("" = repo root)
  local name="$1" url="$2" subdir="${3:-}"
  local tmp found=0
  tmp=$(mktemp -d)

  if ! git clone --depth 1 -q "$url" "$tmp" 2>"$tmp.err"; then
    echo "Master Hub: FAILED to clone $name from $url" >&2
    sed 's/^/  /' "$tmp.err" >&2
    rm -rf "$tmp" "$tmp.err"
    missing+=("$name")
    return 1
  fi
  rm -f "$tmp.err"

  # Some packs ship one skill at the repo root, others a directory of them.
  install_skill_dir "$tmp" "$name" && found=1

  local root="$tmp"
  [ -n "$subdir" ] && [ -d "$tmp/$subdir" ] && root="$tmp/$subdir"
  for d in "$root"/*/; do
    [ -d "$d" ] || continue
    install_skill_dir "${d%/}" "$(basename "$d")" && found=1
  done

  rm -rf "$tmp"
  if [ "$found" -eq 0 ]; then
    echo "Master Hub: cloned $name but found no SKILL.md to install" >&2
    missing+=("$name")
    return 1
  fi
}

# 1. Skills committed directly in this repo (e.g. impeccable)
if [ -d "$REPO_DIR/.claude/skills" ]; then
  for d in "$REPO_DIR"/.claude/skills/*/; do
    [ -d "$d" ] || continue
    install_skill_dir "${d%/}" "$(basename "$d")"
  done
fi

# 2. Remote skill packs — add a line here to onboard a new pack.
#    name              git URL                                                  skills subdir
install_pack "gstack"    "https://github.com/garrytan/gstack.git"                ""
install_pack "marketing" "https://github.com/coreyhaines31/marketingskills.git"  "skills"

echo "Master Hub: synced $installed skills into $SKILLS_DIR"
if [ "${#missing[@]}" -gt 0 ]; then
  echo "Master Hub: packs NOT installed: ${missing[*]}" >&2
fi
exit 0
