You are setting up **GBrain** — a persistent, structured knowledge base that travels across all Claude Code sessions.

GBrain stores project insights, client context, decisions, and learnings so you never start from zero.

---

## Setup Steps

### Step 1 — Verify the MCP Connection
Check that the GBrain/agentmemory MCP server is configured in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "agentmemory": {
      "command": "node",
      "args": ["PATH_TO_AGENTMEMORY_CLI", "mcp"],
      "env": {
        "AGENTMEMORY_III_PATH": "PATH_TO_III_BINARY"
      }
    }
  }
}
```

If not configured, add it and restart Claude Code.

### Step 2 — Create the Knowledge Base Structure
Seed GBrain with core context categories:

```
CATEGORY: meta
TITLE: GBrain Setup
CONTENT: GBrain is active. Use /learn to save insights. Use /recall to retrieve.
```

```
CATEGORY: identity
TITLE: Working Style
CONTENT: [Describe your working preferences, tools, session formula]
```

```
CATEGORY: clients
TITLE: Client Index
CONTENT: [List active clients, their repos, and their current phase]
```

### Step 3 — Seed Initial Context
Save these records now:
- Your name and role
- Active projects and their status
- Top 3 things Claude should always remember about how you work
- Any standing preferences (e.g., "always use TypeScript", "never create docs files without asking")

### Step 4 — Verify Retrieval
Test by asking: "What do you know about me?" — GBrain should return the seeded context.

---

## GBrain Commands
- `/learn` — Save a new learning or insight
- `/setup-gbrain` — Run this setup again (to add more context)
- Recall is automatic — GBrain context loads at session start via the MCP server
