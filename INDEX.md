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

### gstack — AI Engineering Toolkit
- **Location:** `~/.claude/skills/gstack/`
- **Source:** https://github.com/garrytan/gstack
- **Key skills:** `/qa` `/review` `/ship` `/browse` `/cso` `/autoplan` `/office-hours`
- **Status:** ✅ Active

### marketing — Marketing Skills
- **Location:** `~/.claude/skills/` (via Claude BOX)
- **Source:** https://github.com/coreyhaines31/marketingskills
- **Key skills:** `/copywriting` `/cro` `/marketing-psychology` `/seo-audit` `/emails`
- **Status:** ✅ Active

### research — Research Skills
- **Status:** ❌ Not yet installed
- **TODO:** Find & install research skills repo

### efficiency — Prompt Efficiency Skills
- **Status:** ❌ Not yet installed
- **TODO:** Find & install efficiency/token-saving skills repo

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
