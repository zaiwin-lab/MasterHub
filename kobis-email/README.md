# kobisbhd.com — Email Setup

Runbook for bringing `kobisbhd.com` from a freshly-registered domain to a
domain that can **receive** mail (Cloudflare Email Routing) and **send**
authenticated campaigns (Brevo).

> `kobisberhad.com` is a **separate, legacy domain** on Rumahweb DNS with Titan
> email. It is out of scope and must not be modified. The scripts here hard-code
> `kobisbhd.com` and refuse to run against it.

## Verified starting state

Measured from public DNS on 2 Aug 2026, not assumed:

| Check | kobisbhd.com | kobisberhad.com |
|---|---|---|
| Nameservers | Cloudflare (`joyce`/`aiden.ns.cloudflare.com`) | Rumahweb |
| Apex A | `75.2.60.5` (Netlify) | `75.2.60.5` |
| MX | **none** | `0 kobisberhad.com` |
| SPF | **none** | `v=spf1 +ip4:202.10.43.163 +include:spf.titan.email ~all` |
| DKIM | **none** | — |
| DMARC | **none** | — |

**Consequence:** with no MX, every address `@kobisbhd.com` currently bounces.
With no SPF/DKIM/DMARC, any Brevo campaign from this domain lands in spam or is
rejected outright. Both must be fixed before sending anything.

Supporting facts: domain registered on Cloudflare 2 Aug 2026; Brevo account
validated 1 Aug 2026; no Cloudflare Email Routing verification email has ever
been sent to `zaiwin@gmail.com`.

## What needs to exist when finished

| Type | Name | Value | Added by |
|---|---|---|---|
| MX ×3 | `kobisbhd.com` | `*.mx.cloudflare.net` | Cloudflare, automatically |
| TXT | `kobisbhd.com` | `v=spf1 include:spf.brevo.com include:_spf.mx.cloudflare.net ~all` | manual — see warning |
| TXT | `brevo._domainkey.kobisbhd.com` | *(from Brevo dashboard)* | manual |
| TXT | `brevo-code.kobisbhd.com` | *(from Brevo dashboard)* | manual |
| TXT | `_dmarc.kobisbhd.com` | `v=DMARC1; p=none; rua=mailto:admin@kobisbhd.com` | manual |

### The one thing that silently breaks this

**A domain may publish only ONE SPF record.** Cloudflare Email Routing adds its
own SPF when you enable it, and Brevo will tell you to add another. Two SPF
records is a hard failure — receivers return `permerror` and *both* inbound
forwarding and outbound campaigns degrade.

Do not add Brevo's SPF as a second record. Edit the existing one so a single TXT
contains both includes, exactly as in the table above.

Start DMARC at `p=none`. It reports without enforcing, so a misconfiguration
cannot silently blackhole mail during launch. Tighten to `p=quarantine` only
after the reports are clean.

## Running it

### Path A — automated (preferred)

Create a Cloudflare API token at
<https://dash.cloudflare.com/profile/api-tokens> → *Create Custom Token*,
**scoped to `kobisbhd.com` only**:

- Zone → Zone → **Read**
- Zone → DNS → **Edit**
- Zone → Email Routing Rules → **Edit**
- Account → Email Routing Addresses → **Edit**

Then:

```bash
CF_API_TOKEN=<token> ./scripts/setup-cloudflare-email.sh
```

This enables Email Routing, registers `zaiwin@gmail.com` as the destination,
and forwards `outreach@`, `admin@`, `setiausaha@` and `chairman@` to it. It is
idempotent — safe to re-run.

Scope the token to the one zone and revoke it once setup is confirmed.

### Path B — Cloudflare dashboard

1. Cloudflare → `kobisbhd.com` → **Email** → **Email Routing** → *Get started*.
2. Accept the MX + SPF records it offers to add automatically.
3. **Destination addresses** → add `zaiwin@gmail.com`.
4. Open the verification email Cloudflare sends and click the link.
   *Forwarding does not work until this is done.*
5. **Routing rules** → create four custom addresses, each forwarding to
   `zaiwin@gmail.com`:
   `outreach@` · `admin@` · `setiausaha@` · `chairman@`

### Brevo (either path)

1. Brevo → **Senders, Domains & Dedicated IPs** → **Domains** → add
   `kobisbhd.com`.
2. Copy the `brevo-code` and `brevo._domainkey` values it shows into Cloudflare
   DNS as TXT records.
3. Merge Brevo's SPF into the single existing SPF record — see the warning above.
4. Add the DMARC record.
5. Back in Brevo, click **Authenticate / Verify**.

## Verifying

```bash
./scripts/verify-dns.sh
```

Checks MX, SPF (including the two-record failure mode), DKIM, the Brevo code and
DMARC from public DNS. No credentials needed. Exits non-zero until the domain is
genuinely ready. Run it from outside any dashboard — it reads what the rest of
the internet sees, not what a control panel claims.

DNS changes need a few minutes to propagate; Brevo verification can take longer.

## Before the CIDB campaign

Do not send 300 emails from a domain registered today — that is the single
fastest way to burn its reputation permanently.

1. `./scripts/verify-dns.sh` passes clean.
2. Send a test to a Gmail, an Outlook and a Yahoo address. In Gmail use
   *Show original* and confirm **SPF: PASS, DKIM: PASS, DMARC: PASS**.
3. Send to 50 real contacts. Check bounces, spam placement, link/QR behaviour.
4. Only if clean, release the remaining 250.
5. Every campaign needs a working unsubscribe link and a physical postal address
   in the footer — required by Gmail/Yahoo bulk sender rules, and the contacts
   are business records sourced from CIDB rather than people who opted in.

## Netlify note

`www.kobisbhd.com` is live and serving a valid Let's Encrypt certificate
(CN `kobisbhd.com`, expires 31 Oct 2026); the apex redirects to it correctly.

The *"Certificate renewal incomplete: missing domains kobisbhd.com"* banner in
Netlify is stale — it dates from an attempt made while the newly-registered
domain was still propagating, and the certificate issued successfully
afterwards. No action needed. If it is still showing well after propagation,
click **Renew certificate** once; there is no reason to touch a working
production certificate before then.
