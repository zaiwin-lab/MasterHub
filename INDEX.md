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

## MCP Servers & Tools

Connected in this session via the Claude Code on the web environment.

| Server | Status | Key Capabilities |
|--------|--------|------------------|
| GitHub | ✅ Connected | PRs, issues, branches, CI/actions, code search |
| Gmail | ✅ Connected | Search threads, drafts, labels |
| Google Calendar | ✅ Connected | Create/update events, suggest times |
| Google Drive | ✅ Connected | Read/search/create files |
| HubSpot | ✅ Connected | CRM objects, campaigns, contacts |
| Jotform | ✅ Connected | Forms, submissions, apps |
| Netlify | ✅ Connected | Deploy/site management |
| agentmemory | ⚙️ Local config | Persistent agent memory (see `.claude/settings.json`) |

---

## Skills Installed

Skills are auto-installed into `~/.claude/skills/` at the start of every
session by `.claude/hooks/session-start.sh` (registered as a `SessionStart`
hook in `.claude/settings.json`). This guarantees every cloud session has
the full skill set, even though the container starts fresh each time.

**Current session:** synced **101 skills** into `~/.claude/skills/`.

### impeccable — Frontend design skill
- **Source:** committed directly in this repo at `.claude/skills/impeccable/`
- **Status:** ✅ Active

### gstack — AI Engineering Toolkit
- **Source:** https://github.com/garrytan/gstack (cloned fresh by the hook)
- **Key skills:** `/qa` `/review` `/ship` `/browse` `/cso` `/autoplan` `/office-hours` `/investigate` `/design-review` `/design-html` `/document-generate` `/learn` `/setup-gbrain`
- **Status:** ✅ Active

### marketing — Marketing Skills (43 skills)
- **Source:** https://github.com/coreyhaines31/marketingskills (cloned fresh by the hook)
- **Key skills:** `/copywriting` `/cro` `/marketing-psychology` `/seo-audit` `/emails` `/ad-creative` `/pricing` `/content-strategy`
- **Status:** ✅ Active

### Built-in Claude Code skills (always available)
- `/code-review` `/security-review` `/run` `/verify` `/simplify` `/deep-research` `/init` and others
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
