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

All skill files are committed inside `.claude/skills/` and auto-installed to `~/.claude/skills/` on every SessionStart via hook.

### gstack — AI Engineering Toolkit
- **Location:** `.claude/skills/gstack/`
- **Source:** https://github.com/garrytan/gstack
- **Key skills:** `/qa` `/review` `/ship` `/browse` `/cso` `/autoplan` `/office-hours` `/plan-ceo-review` `/plan-eng-review` `/design-html` `/design-review` `/investigate` `/document-generate` `/learn` `/setup-gbrain`
- **Status:** ✅ Committed & auto-installed

### impeccable — Premium UI/UX Quality
- **Location:** `.claude/skills/impeccable/`
- **Source:** https://github.com/pbakaus/impeccable
- **Key skills:** `/impeccable audit` `/impeccable polish` `/impeccable critique` `/impeccable animate`
- **Status:** ✅ Committed & auto-installed

### marketing — Marketing Skills
- **Location:** `.claude/skills/marketing/`
- **Source:** https://github.com/coreyhaines31/marketingskills
- **Key skills:** `/copywriting` `/cro` `/marketing-psychology` `/seo-audit` `/emails` `/ad-creative` `/pricing` `/content-strategy`
- **Status:** ✅ Committed & auto-installed

### research — Research Skills
- **Status:** ❌ Not yet installed
- **TODO:** Find & install research skills repo

### efficiency — Prompt Efficiency Skills
- **Status:** ❌ Not yet installed
- **TODO:** Find & install efficiency/token-saving skills repo

---

## Auto-Install Hook
On every session start, `.claude/hooks/session-start.sh` runs and copies all skills from `.claude/skills/` into `~/.claude/skills/` automatically. No manual reinstall needed.

---

## Brain (GBrain)
- **Tool:** GBrain persistent knowledge base
- **Setup:** Run `/setup-gbrain` in any session
- **Status:** ⚠️ Not configured — run setup to activate

---

## Global Config
- **CLAUDE.md:** Root `CLAUDE.md` — skill routing rules
- **settings.json:** `.claude/settings.json` — hooks + MCP servers

---

## Golden Rule
> "Never mix clients. Never mix phases into separate repos. Master Hub always travels with me."
