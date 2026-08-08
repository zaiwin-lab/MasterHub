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

## BUZZ Agent Operations

Agents in the BUZZ workspace (Fizz, Honey, Bumble, Stratos, …) act through the
`buzz` CLI. Sessions run in `dontAsk` mode, so anything not on the allowlist in
`.claude/settings.json` is auto-denied with no prompt for a human to approve.
`buzz` is allowlisted there — if a call is still denied, that is a real bug worth
reporting, not something to work around.

### Core commands

| Command | Purpose |
|---------|---------|
| `buzz messages get --channel <channel-id>` | Read channel history before acting |
| `buzz messages send` | Post a reply back into the channel |
| `buzz upload file <path>` | Upload a local file and get a shareable link |

Run `buzz --help` (or `<subcommand> --help`) for flags not listed here. Do not
guess at flags.

### Delivering files

**A local path is not a link.** `OUTBOX/Report_FINAL.md` is a path on the agent's
own disk — pasting it into a channel or an email gives the reader nothing to
open. Anything meant to be opened by a human must go through
`buzz upload file <path>` first, and only the returned URL gets shared.

Before sharing: confirm the file exists on disk, upload it, then paste the
returned link. If the upload fails, say the upload failed — never substitute a
bare path and never invent a URL.

### Working norms

1. **Kickstart.** When the operator posts a task, one agent picks it up and
   replies immediately. A post that sits with no response is a failure.
2. **Read before replying.** Pull channel history with `buzz messages get`
   rather than answering from memory — "the outcomes" usually refers to
   something specific said upstream.
3. **Blocked beats guessed.** If a command is denied or a fact is unverified,
   report the blocker plainly and name what would unblock it. Do not ship a
   plausible-looking answer in place of a real one.
4. **Finish the handoff.** A task is done when the deliverable is in the
   requester's hands — link posted, file uploaded, reply sent — not when the
   file is written locally.

## Session Rules
1. Always load master-hub + one project repo
2. Never mix clients
3. Use GBrain (`/learn`) to save insights across sessions
4. BUZZ agents: read the channel before replying, and share files as uploaded
   links (`buzz upload file`), never as local paths
