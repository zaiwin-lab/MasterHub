# Master Hub — Claude Code Global Context

## Core Identity
This is the master hub. Load this alongside every project session.

## Skills Available

Four packs, synced into `~/.claude/skills/` on every session start:

| Pack | What it is | Source |
|------|-----------|--------|
| **gstack** | AI engineering toolkit | `github.com/garrytan/gstack` |
| **beauty** | `impeccable` — frontend craft & visual quality | committed at `.claude/skills/impeccable/` |
| **uxui** | `impeccable` + gstack's `design-*` skills | see the UX/UI table below |
| **marketing** | 48 marketing skills | `github.com/coreyhaines31/marketingskills` |

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

### beauty + uxui (Design)
`beauty` and `uxui` are the same layer: `impeccable` carries the craft, gstack's
`design-*` skills carry the review and exploration passes.

| Skill | Purpose |
|-------|---------|
| `/impeccable` | Frontend design & build — craft, polish, audit, animate, live iteration |
| `/design-review` | Designer's-eye QA — spacing, hierarchy, AI-slop patterns |
| `/design-consultation` | Propose a full design system (type, colour, layout, motion) |
| `/design-shotgun` | Generate and compare multiple design variants |
| `/design-html` | Generate HTML/CSS mockups |
| `/plan-design-review` | Design review at the plan stage, before code |
| `/ios-design-review` | Visual audit for iOS apps on real hardware |

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
- Design / beauty / UX / UI → `/impeccable`, then `/design-review` to check the result
- Marketing copy → `/copywriting`
- Conversion → `/cro`
- Security → `/cso`
- Deploy/ship → `/ship`

## Session Rules
1. Always load master-hub + one project repo
2. Never mix clients
3. Use GBrain (`/learn`) to save insights across sessions
