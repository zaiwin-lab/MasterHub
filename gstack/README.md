# gstack — AI Engineering Toolkit

**Installed at:** `~/.claude/skills/gstack/`
**Source:** https://github.com/garrytan/gstack
**Version:** Check with `/gstack-upgrade`

## Install / Update
Handled by the Master Hub skill sync — it clones upstream into
`~/.claude/skills/` and installs each sub-skill as a top-level skill:

```bash
bash MasterHub/.claude/hooks/session-start.sh   # idempotent
FORCE_SYNC=1 bash MasterHub/.claude/hooks/session-start.sh   # pull fresh
```

See "Session Bootstrap" in `../CLAUDE.md` for why this sometimes has to be run
by hand instead of firing as a SessionStart hook.

## Key Skills
- `/office-hours` — product strategy
- `/autoplan` — full auto review pipeline
- `/qa` — browser QA testing
- `/review` — code review
- `/ship` — deploy & PR
- `/cso` — security audit
- `/browse` — headless browser
