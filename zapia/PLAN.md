# ZAPIA 2.0 — WhatsApp MCP plan

Status: **Phase 1 complete (2026-10-09), verified on ZK's Windows PC.**
Phase 2 and Phase 3 need ZK's OK before any build or exposure.

Phase 1 results:
- bridge v0.5.1 installed, SHA-256 `2b7038cd…58ba` matched; registered in Claude Desktop
  (Microsoft Store build). Claude Code CLI is not installed on the PC, so that step was skipped.
- paired; `/api/status` reports `authenticated=True connected=True auth_state=paired`
- first history sync: 3,964 messages across 309 conversations; many chats arrived with only 1 message
- Claude Desktop listed recent chats through the MCP: OK
- "Kenyalang" 5–9 Oct report: 217 chats scanned, 23 recipients, 2 LID-only and unresolved; ZK's spot-check passed

## 0. Read first: limitations and risks

1. **Ban risk.** whatsapp-mcp uses whatsmeow, an unofficial client. WhatsApp can ban the number.
   Pair a **secondary number** first. Bulk promo sending to hundreds of people from an
   unofficial client is the single most likely ban trigger. For bulk promos use the official
   WhatsApp Business Platform. This project reads and reports; it does not do bulk sends.
2. **History is only what the linked device received.** Messages sent *before* pairing exist
   only if WhatsApp's initial history sync delivered them. Recent days (e.g. 5–9 Oct) usually
   arrive; older ones may not. `request_history` can backfill a chat, but it is per-chat and
   best-effort. A report can only be as complete as the local store. The exporter prints
   what it scanned so you can see this.
3. **Phone numbers behind LIDs.** WhatsApp's privacy rollout puts many chats under `@lid` IDs
   with no number. The bridge learns LID↔number links (`jid_aliases`) as it sees them. The
   exporter resolves a number only when the bridge has a proven link, and **never guesses by
   name**. Anything else is listed as `UNRESOLVED`.
4. **Broadcast lists: not verified yet.** If you sent the promo with a WhatsApp broadcast
   list, it is not yet confirmed whether the linked device stores one copy per recipient
   chat or one copy in a `@broadcast` chat. The exporter flags `@broadcast` rows. We find
   out on your real data in Phase 1 step 3.
5. **Your notes vs reality** (checked against the repo on 2026-10-09):
   | Your note | Verified |
   |---|---|
   | latest v0.5.1, 7 Oct 2026 | ✅ tag commit dated 2026-10-07 |
   | `whatsapp-bridge-windows-amd64.exe` + `.sha256` | ✅ both downloaded; SHA-256 `2b7038cd…58ba` matches |
   | REST on 127.0.0.1:8080, `/api/status` | ✅ the bridge **refuses** to bind to anything but loopback |
   | Python MCP via uv, stdio | ✅ `uv --directory …/whatsapp-mcp-server run main.py` |
   | **11 tools** | ❌ **14 tools.** v0.5.0 added `search_groups`, `download_media` and `request_history` |
   | media-send / group-broadcast not shipped | ✅ no MCP tool for either (there is bridge code for outbound media, but no tool) |
   | every send needs `confirm_send` | ✅ `send_message` creates a draft, `confirm_send` sends it |
   | DB is SQLCipher | ✅ key lives in Windows Credential Manager |
   | `MYCELIUM_NO_PING=1` | ✅ honoured by `hooks/install-ping.py`. That hook only runs for a Claude Code *plugin* install, and we install with `claude mcp add`, but the variable is set anyway |
6. **There is no "search my sent messages" tool upstream.** `list_messages` works per chat
   only, and there is no text or date filter. `wa_sent_report.py` fills the gap by walking
   every chat through the bridge's REST API. It is read-only and never touches the DB key.
7. **Your original `setup-whatsapp-mcp.ps1` was not available to me.** It is not in this repo
   or in the session. I wrote a new one from the verified facts. To have yours reviewed,
   commit it to `zapia/` and I will diff it against this one.
8. **I run in a cloud container, not on your PC.** I cannot run the installer, show you the QR
   or call your bridge. You run Phase 1, paste me the output, and I verify it.

## Phase 1 — local install (you run; I verify from your output)

| Step | Command (PowerShell, from this `zapia` folder) | Pass condition |
|---|---|---|
| 1 Install | `powershell -ExecutionPolicy Bypass -File .\setup-whatsapp-mcp.ps1` | `OK sha256 2b7038cd…` and no red errors |
| 2 Pair | New window: `cd $env:USERPROFILE\.claude\whatsapp-mcp\whatsapp-bridge; .\bin\whatsapp-bridge.exe`, then scan the QR with the **secondary** phone | phone shows the linked device |
| 3 Verify | `powershell -ExecutionPolicy Bypass -File .\setup-whatsapp-mcp.ps1 -VerifyOnly` | `authenticated=True connected=True` |
| 4 Tools | Restart Claude Desktop and Claude Code, run `claude mcp list`, then ask *"list my 10 most recent WhatsApp chats"* | `whatsapp` connected, 14 tools, chats returned |
| 5 Core use case | `uv run --python 3.11 wa_sent_report.py --phrase "My Kenyalang Homes" --from 2026-10-05 --to 2026-10-09 --out kenyalang.csv` | CSV opens in Excel; the summary lists unresolved LIDs |
| 6 Spot-check | Pick 5 people you *know* you sent it to and confirm each is in the CSV. Also check one broadcast-list send if you used one | 5/5 present |

The installer pins v0.5.1, verifies the SHA-256 before installing, refuses to overwrite a
running bridge, sets `MYCELIUM_NO_PING=1` and backs up `claude_desktop_config.json` before
merging. It also handles the Microsoft Store build of Desktop. It never prints the DB key.

CSV columns: `name, phone, phone_source (jid | contact-alias | UNRESOLVED), chat_type,
first_sent_myt, last_sent_myt, times_sent, jids, message_ids`. Times are in MYT. The file is
UTF-8 with BOM so Malay and Chinese names display correctly in Excel. Matching ignores case,
accents and extra spaces, and you can repeat `--phrase` for BM/EN variants (OR match).

**Keep `kenyalang.csv` and other exports out of git.** They contain phone numbers. `.gitignore` covers `*.csv` here.

## Phase 2 — remote MCP gateway for claude.ai (NEEDS YOUR OK)

### What claude.ai can actually connect to
- claude.ai custom connectors call a **public HTTPS** MCP URL from Anthropic's cloud, using
  Streamable HTTP (SSE is legacy but accepted).
- Auth options are **OAuth** (authorization-code + PKCE, with dynamic client registration or a
  client ID/secret entered in the connector's advanced settings) or none. **You cannot attach
  a static bearer-token header**, so "long random bearer token" alone will not work from
  claude.ai. **OAuth is required.** I will re-check the current connector docs before building.
- **Cloudflare Access interactive login in front breaks it.** Anthropic's servers cannot click
  through an Access login page, and service-token headers cannot be set. Cloudflare's own
  MCP-OAuth integration for Access may solve this. I will verify it before relying on it.

### Tunnel choice
| | Cloudflare named tunnel | Tailscale Funnel |
|---|---|---|
| Reachable by claude.ai | yes | yes |
| Where TLS ends | Cloudflare edge (Cloudflare can see the traffic) | your PC (end-to-end) |
| Edge IP allowlist / WAF / rate limit | **yes**: allow only Anthropic's published outbound IP ranges | no; everything hits your PC |
| Needs | a domain on Cloudflare (free plan is fine) | Tailscale account; ports 443/8443/10000 only |
| Stable URL | `https://wa.<yourdomain>` | `https://<pc>.<tailnet>.ts.net` |

**Recommendation: Cloudflare named tunnel**, with a WAF rule that allows only Anthropic's
outbound IPs, an edge rate limit, and the gateway's own OAuth. The edge IP allowlist means a
leaked URL is unreachable to anyone else, and that outweighs Funnel's end-to-end TLS for this
threat model. Your chat data already goes to Anthropic once Claude reads it either way. If you
do not want Cloudflare to see the traffic, Funnel plus OAuth plus a strict gateway rate limit
also works, with weaker perimeter control.

### Gateway design
```
claude.ai ──HTTPS──> Cloudflare edge (IP allowlist, rate limit)
   ──tunnel──> gateway 127.0.0.1:8787  (OAuth 2.1 AS+RS, allowlist, audit, rate limit)
       ──stdio──> upstream whatsapp-mcp main.py  (scrubber + audit log stay ON)
           ──HTTP──> bridge 127.0.0.1:8080  (never exposed)
```
- Python + FastMCP (already a dependency), run as a **proxy over the upstream stdio server**.
  Every call passes through upstream `main.py`, so its prompt-injection scrubber and audit log
  are kept unchanged.
- **Remote allowlist (read-only):** `healthcheck, list_chats, search_contacts, search_groups,
  list_messages`, plus a new `find_sent_recipients` (the Phase 1 exporter as a tool, returning
  rows and CSV text).
- **Local-only:** `send_message, confirm_send, send_reply_quote, send_reaction, mark_chat_read,
  send_typing_indicator, set_online_presence, request_history, download_media`. Enabling sends
  remotely later takes an explicit config flag, and `confirm_send` stays mandatory.
- **OAuth:** a single-user authorization server in the gateway. The consent page asks for a
  passphrase you set at install, stored as an Argon2 hash. Tokens are short-lived, refresh
  tokens rotate, and there is a one-command "revoke all".
- **Every remote call is logged** to a local JSONL file: time, tool, client, IP and result
  size. Arguments are stored hashed, not raw. The log never contains tokens and is never
  committed.
- **Rate limit:** 30 calls/min and 500/day per client in the gateway, plus the edge rule.
- **Secrets:** the passphrase hash and signing key live in Windows Credential Manager. Nothing
  goes in `.env`, logs or git.
- **End-to-end test:** add the connector in claude.ai under Settings → Connectors → Add custom
  connector with URL `https://wa.<yourdomain>/mcp`, complete the OAuth login, then ask
  *"list my 10 most recent WhatsApp chats"* and run one `find_sent_recipients` query. I also
  confirm that an unauthenticated `curl` gets 401, that a send tool is absent, and that a
  non-Anthropic IP is blocked at the edge.

## Phase 3 — local web portal (NEEDS YOUR OK)
- One Python process on `127.0.0.1:8765`: a single HTML page with vanilla JS/CSS and no build
  step, served next to a small JSON API that reuses `wa_sent_report.py`.
- Pages: link status (paired/connected, last error), chat search, recipient-list builder
  (phrase or phrases + date range → table with name, phone and phone source, plus CSV
  download), and an unresolved-LID panel.
- Unlink: shows the steps (phone → Linked Devices → log out). No one-click remote unlink.
- Protection: loopback only, Host-header pin, CSRF token, no CORS. It is optionally reachable
  through the Phase 2 tunnel behind the same OAuth, and **off by default**.

## Decisions I need from you
1. OK to start Phase 2? If yes, do you have a domain on Cloudflare? If not, should I use Tailscale Funnel?
2. Is the number you will pair a secondary number?
3. Did you send the Kenyalang promo one-by-one, through a broadcast list, or into groups?
