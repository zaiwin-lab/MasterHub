# Master Hub — Claude Code Global Context

## Core Identity
This is the master hub. Load this alongside every project session.

## Session Bootstrap (run this first)

`gstack` and `marketing` are cloned from upstream, not committed here, so a fresh
cloud container starts without them. `.claude/settings.json` registers a
SessionStart hook, but that hook only fires when this repo *is* the project dir —
in a multi-repo session (MasterHub + a client repo) the project dir is their
shared parent and the hook never runs.

So: at the start of every session, if `~/.claude/skills/gstack/SKILL.md` is
missing, run the sync by hand.

```bash
bash MasterHub/.claude/hooks/session-start.sh   # from the workspace root
```

It is idempotent (a no-op once synced) and exits non-zero if `gstack` or
`impeccable` is missing. Use `FORCE_SYNC=1` to pull fresh copies from upstream.

## Skills Available

### impeccable (Frontend Design)
Committed in this repo at `.claude/skills/impeccable/` — always available, no clone needed.

| Skill | Purpose |
|-------|---------|
| `/impeccable` | Design, audit, polish & harden frontend interfaces |

### gstack (AI Engineering)
Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools directly.

| Skill | Purpose |
|-------|---------|
| `/office-hours` | Product strategy & planning |
| `/autoplan` | Auto CEO + Design + Eng review |
| `/plan-ceo-review` | CEO-level feature review |
| `/plan-eng-review` | Engineering architecture review |
| `/review` | Production code review |
| `/qa` | Browser-based QA testing |
| `/ship` | Automated PR & deployment |
| `/cso` | OWASP + STRIDE security audit |
| `/browse` | Headless browser — navigate & screenshot |
| `/investigate` | Root cause debugging |
| `/design-html` | Generate HTML/CSS mockups |
| `/design-review` | UI/design quality review |
| `/document-generate` | Documentation generation |
| `/learn` | Save learning to GBrain memory |
| `/setup-gbrain` | Set up GBrain knowledge base |

### marketing (Marketing Skills)
| Skill | Purpose |
|-------|---------|
| `/copywriting` | Conversion copywriting |
| `/cro` | Conversion rate optimisation |
| `/marketing-psychology` | Colour, layout & persuasion |
| `/seo-audit` | Technical SEO audit |
| `/emails` | Email sequences |
| `/ad-creative` | Ad copy & creatives |
| `/pricing` | Pricing strategy |
| `/content-strategy` | Content planning |

## Skill Routing
When user request matches a skill, invoke it via the Skill tool.

- Product/strategy → `/office-hours` → `/autoplan`
- Code review → `/review`
- QA/testing → `/qa`
- Design → `/design-review` or `/design-html`
- Marketing copy → `/copywriting`
- Conversion → `/cro`
- Security → `/cso`
- Deploy/ship → `/ship`

## Session Rules
1. Always load master-hub + one project repo
2. Never mix clients
3. Use GBrain (`/learn`) to save insights across sessions
