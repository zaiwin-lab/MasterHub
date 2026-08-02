# gstack — AI Engineering Toolkit

**Source:** https://github.com/garrytan/gstack
**Installed to:** `~/.claude/skills/` (gstack root + one dir per sub-skill)
**Installer:** `../.claude/hooks/session-start.sh`
**Version:** Check with `/gstack-upgrade`

gstack is *not* vendored into this repo — it is cloned fresh into `~/.claude/skills/`
by the Master Hub session-start hook, so it always tracks upstream.

## Install / refresh

The hook runs automatically only when MasterHub is the project root. In a multi-repo
Claude Code web session it does not fire, so run it yourself:

```bash
bash MasterHub/.claude/hooks/session-start.sh          # install if missing (idempotent)
bash MasterHub/.claude/hooks/session-start.sh --force   # re-clone from upstream
```

This installs ~54 gstack skills plus the marketing skill set. Verify by checking that
`/browse` and `/office-hours` appear in the skill list.

Manual upstream install (outside this repo's flow):

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

## Key Skills
- `/office-hours` — product strategy
- `/autoplan` — full auto review pipeline
- `/qa` — browser QA testing
- `/review` — code review
- `/ship` — deploy & PR
- `/cso` — security audit
- `/browse` — headless browser
