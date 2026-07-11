# gstack — AI Engineering Toolkit

**Installed at:** `~/.claude/skills/gstack/`
**Source:** https://github.com/garrytan/gstack
**Version:** Check with `/gstack-upgrade`

## Why isn't gstack committed to this repo?

gstack builds to **~1.6 GB** (node_modules + compiled binaries + ML runtimes),
which is far past GitHub's file-size limits and would bloat this repo. It is
designed to be installed via `git clone + ./setup`, not checked in. So instead
of committing it, this repo ships a one-command installer.

## Install (one command)

From the repo root:

```bash
bash .claude/scripts/install-gstack.sh
```

This clones gstack into `~/.claude/skills/gstack` and runs its `setup`
(builds the headless browser binary and registers all skills). It is
idempotent and safe to re-run — re-running also updates gstack to latest.

Manual equivalent:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

> Note: gstack lives in `~/.claude/` (the session harness), which is ephemeral
> on Claude Code web sessions. Re-run the installer at the start of any session
> where you need gstack. Ask Claude to "install gstack" and it will run the
> script for you.

## Key Skills
- `/office-hours` — product strategy
- `/autoplan` — full auto review pipeline
- `/qa` — browser QA testing
- `/review` — code review
- `/ship` — deploy & PR
- `/cso` — security audit
- `/browse` — headless browser
