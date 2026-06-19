# Master Hub — Claude Code Global Context

## Core Identity
This is the master hub. Load this alongside every project session.

## Engineering Principles
Apply these on every coding task. They bias toward caution over speed — for trivial tasks, use judgment.
_(Derived from Andrej Karpathy's observations on LLM coding pitfalls.)_

### 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop, name what's confusing, and ask.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility"/"configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it. Ask: "Would a senior engineer call this overcomplicated?"

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor what isn't broken. Match existing style.
- Remove imports/vars/functions that YOUR changes orphaned — don't delete pre-existing dead code (mention it instead).
- The test: every changed line traces directly to the request.

### 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**
- Turn tasks into verifiable goals: "Fix the bug" → "Write a test that reproduces it, then make it pass."
- For multi-step work, state a brief plan with a `verify:` check per step.
- Strong success criteria let you loop independently; weak criteria ("make it work") force constant clarification.

**Working if:** fewer unnecessary diff lines, fewer rewrites from overcomplication, and clarifying questions come *before* implementation rather than after mistakes.

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
