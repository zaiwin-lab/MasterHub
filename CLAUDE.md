# Master Hub — Claude Code Global Context

## Core Identity
This is the master hub. Load this alongside every project session.

## Skills Available

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

### frontend (Frontend Engineering)
| Skill | Purpose |
|-------|---------|
| `/build-component` | Build UI components (HTML/CSS/JS) |
| `/responsive` | Audit and fix responsive layout |
| `/frontend-review` | HTML/CSS/JS code quality review |
| `/lighthouse` | Performance, accessibility & SEO audit |
| `/animation` | CSS animations and scroll reveals |
| `/forms` | Build accessible, conversion-optimised forms |

## Skill Routing
When user request matches a skill, invoke it via the Skill tool.

- Product/strategy → `/office-hours` → `/autoplan`
- Code review → `/review`
- Frontend review → `/frontend-review`
- QA/testing → `/qa`
- Design → `/design-review` or `/design-html`
- Build UI component → `/build-component`
- Responsive fix → `/responsive`
- Performance → `/lighthouse`
- Marketing copy → `/copywriting`
- Conversion → `/cro`
- Security → `/cso`
- Deploy/ship → `/ship`

## Session Rules
1. Always load master-hub + one project repo
2. Never mix clients
3. Use GBrain (`/learn`) to save insights across sessions
