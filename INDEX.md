# master-hub
> "Master Hub = my brain. Always loads with every session."

---

## What This Is
Central skills & config hub. Load this repo alongside every project repo in Claude Code.

**Session Formula:**
```
master-hub + mvp-[client]     ← for MVP builds
master-hub + sys-[name]       ← for system builds
master-hub only               ← for research
```

---

## Skills Installed

Skills are auto-installed into `~/.claude/skills/` at the start of every
session by `.claude/hooks/session-start.sh` (registered as a `SessionStart`
hook in `.claude/settings.json`). This guarantees every cloud session has
the full skill set, even though the container starts fresh each time.

**Adding a new remote pack:** add one `install_pack` line to
`.claude/hooks/session-start.sh` — name, git URL, and the subdirectory that
holds the skills (empty string if they sit at the repo root).

**Note on cloud sessions:** when several repos are cloned side by side, the
workspace root is the parent directory (`/home/user`), not this repo, so
`$CLAUDE_PROJECT_DIR` does not point here. Both the hook registration and the
script itself resolve the repo from their own location instead, so the sync
works whether the session opens this repo directly or as one of several.

### impeccable — Frontend design skill
- **Source:** committed directly in this repo at `.claude/skills/impeccable/`
- **Status:** ✅ Active

### gstack — AI Engineering Toolkit
- **Source:** https://github.com/garrytan/gstack (cloned fresh by the hook)
- **Key skills:** `/qa` `/review` `/ship` `/browse` `/cso` `/autoplan` `/office-hours`
- **Status:** ✅ Active

### marketing — Marketing Skills (43 skills)
- **Source:** https://github.com/coreyhaines31/marketingskills (cloned fresh by the hook)
- **Key skills:** `/copywriting` `/cro` `/marketing-psychology` `/seo-audit` `/emails`
- **Status:** ✅ Active

### research / efficiency
- **Status:** ❌ Not yet installed — no source repo identified yet

---

## Brain (GBrain)
- **Tool:** GBrain persistent knowledge base
- **Setup:** Run `/setup-gbrain` in any session
- **Status:** ⚠️ Not configured — run setup to activate
- **Docs:** `~/.claude/skills/gstack/USING_GBRAIN_WITH_GSTACK.md`

---

## Global Config
- **CLAUDE.md:** `~/.claude/CLAUDE.md` — gstack skill routing rules
- **settings.json:** `~/.claude/settings.json` — MCP servers (agentmemory)

---

## Golden Rule
> "Never mix clients. Never mix phases into separate repos. Master Hub always travels with me."
