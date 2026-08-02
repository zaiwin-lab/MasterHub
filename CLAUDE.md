# Master Hub — Claude Code Global Context

## Core Identity
This is the master hub. Load this alongside every project session.

## Session Bootstrap (do this first)
`.claude/hooks/session-start.sh` installs gstack + marketing into `~/.claude/skills/`.
It only fires automatically when **this repo is the project root**. In Claude Code on
the web with more than one repo loaded, the project root is the *parent* directory, so
`MasterHub/.claude/settings.json` is never read and the hook never runs — gstack and the
marketing skills are silently absent.

So at the start of any session, if `/browse` or `/office-hours` are not in the skill list:

```bash
bash MasterHub/.claude/hooks/session-start.sh
```

It is idempotent (~40s on a cold container, instant if already installed). Add `--force`
to re-clone from upstream. `impeccable` is committed in this repo and loads natively —
it never needs the hook.

## Skills Available

### impeccable (UX/UI) — vendored in this repo
`.claude/skills/impeccable/` — frontend design, UX review, and visual polish.
Loads natively from the repo; no install step.

Invoke as `/impeccable <sub-command> <target>`:

| Sub-commands | Purpose |
|--------------|---------|
| `craft` · `shape` | Build new UI / restructure information architecture |
| `audit` · `critique` | UX + visual critique, anti-pattern detection |
| `animate` · `bolder` · `colorize` · `delight` · `layout` · `overdrive` · `quieter` · `typeset` | Turn the visual dial — motion, colour, type, layout, intensity |
| `adapt` · `clarify` · `distill` | Responsive/theming, UX copy, cut cognitive load |
| `harden` · `onboard` · `optimize` · `polish` | Accessibility & edge cases, first-run, performance, final pass |
| `init` · `document` · `extract` · `live` | Set up PRODUCT.md/DESIGN.md, document, pull out tokens, live browser iteration |

### gstack (AI Engineering)

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
