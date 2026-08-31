# ZK30 MFDB Command Centre

Executive intelligence dashboard (Overview / LEXA / SP3B / MVP / Calendar /
Partnerships / KPI). Static site + one serverless function that exposes the
data as an **MCP server**.

## Pages
Static HTML + `acis-modules.css`. A client-side passcode gate (code on the
page) covers every page. Data lives in each page (seed arrays) with per-browser
localStorage for edits.

## MCP server  — `/mcp`
`netlify/functions/mcp.mjs` is a zero-dependency MCP server (Streamable HTTP,
JSON-RPC 2.0). Point any MCP client (Gemini Spark, Claude, etc.) at
`https://zk30-mfdb.netlify.app/mcp`.

Tools: `get_overview`, `get_top_priorities`, `list_lexa`, `get_lexa`, `search`.

**Auth (optional):** set Netlify env `MCP_TOKEN`. When set, callers must pass
`Authorization: Bearer <token>` or `?key=<token>` (handy for URL-only clients:
`https://zk30-mfdb.netlify.app/mcp?key=<token>`). If unset, the endpoint is open
(read-only). The MCP data is a snapshot regenerated from the dashboard on each
build.

## Deploy (Netlify, git-connected — required for the function)
1. Netlify → the `zk30-mfdb` site → Build & deploy → link this repo
   (`zaiwin-lab/MasterHub`), **base directory `zk30-mfdb`**, publish `.`,
   functions `netlify/functions`, no build command.
2. (Optional) set env `MCP_TOKEN`.
3. Deploy. The `/mcp` endpoint goes live automatically.

A plain drag-and-drop zip deploy serves the pages but may not run the function;
use the git-connected deploy above for `/mcp`.
