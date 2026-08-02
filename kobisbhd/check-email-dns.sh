#!/usr/bin/env bash
# check-email-dns.sh — verify the kobisbhd.com mail stack from DNS alone.
#
# Uses DNS-over-HTTPS so it works anywhere curl works (no dig required).
# Run it after every DNS change; it tells you which step is still outstanding.
#
#   ./check-email-dns.sh              # defaults to kobisbhd.com
#   ./check-email-dns.sh example.com  # any domain

set -uo pipefail

DOMAIN="${1:-kobisbhd.com}"
DOH="https://cloudflare-dns.com/dns-query"

PASS=0
FAIL=0

query() {
  # query <name> <type> -> prints one record per line
  curl -sS -H 'accept: application/dns-json' "$DOH?name=$1&type=$2" \
    | python3 -c 'import sys,json; print("\n".join(a.get("data","") for a in json.load(sys.stdin).get("Answer",[])))' \
    2>/dev/null
}

report() {
  # report <ok|no> <label> <detail>
  if [ "$1" = "ok" ]; then
    PASS=$((PASS+1)); printf '  \033[32mPASS\033[0m  %-26s %s\n' "$2" "$3"
  else
    FAIL=$((FAIL+1)); printf '  \033[31mFAIL\033[0m  %-26s %s\n' "$2" "$3"
  fi
}

echo
echo "Mail stack check — $DOMAIN"
echo "-------------------------------------------------------------"

# 1. Nameservers must be Cloudflare, otherwise none of the rest applies.
NS=$(query "$DOMAIN" NS)
if echo "$NS" | grep -qi 'ns.cloudflare.com'; then
  report ok "nameservers" "Cloudflare"
else
  report no "nameservers" "${NS:-none} (expected *.ns.cloudflare.com)"
fi

# 2. MX — present only once Cloudflare Email Routing is actually enabled.
#    Without this the forwarding rules exist but never receive anything.
MX=$(query "$DOMAIN" MX)
if echo "$MX" | grep -qi 'mx.cloudflare.net'; then
  report ok "MX (inbound routing)" "$(echo "$MX" | tr '\n' ' ')"
elif [ -n "$MX" ]; then
  report no "MX (inbound routing)" "non-Cloudflare MX: $(echo "$MX" | tr '\n' ' ')"
else
  report no "MX (inbound routing)" "no MX — Email Routing not enabled"
fi

# 3. SPF — exactly one record, and it must authorise both senders.
TXT=$(query "$DOMAIN" TXT)
SPF=$(echo "$TXT" | grep -i 'v=spf1' || true)
SPF_COUNT=$(echo "$SPF" | grep -c 'v=spf1' || true)
if [ "$SPF_COUNT" -gt 1 ]; then
  report no "SPF" "$SPF_COUNT SPF records — must be exactly 1 (permerror)"
elif [ -z "$SPF" ]; then
  report no "SPF" "missing"
else
  MISSING=""
  echo "$SPF" | grep -qi '_spf.mx.cloudflare.net' || MISSING="$MISSING include:_spf.mx.cloudflare.net"
  echo "$SPF" | grep -qi 'spf.brevo.com'         || MISSING="$MISSING include:spf.brevo.com"
  if [ -z "$MISSING" ]; then
    report ok "SPF" "single record, both includes present"
  else
    report no "SPF" "missing:$MISSING"
  fi
fi

# 4. Brevo ownership code.
if echo "$TXT" | grep -qi 'brevo-code'; then
  report ok "Brevo verification code" "present"
else
  report no "Brevo verification code" "no brevo-code TXT on root"
fi

# 5. DKIM — Brevo signs with the brevo._domainkey selector.
DKIM=$(query "brevo._domainkey.$DOMAIN" TXT)
if echo "$DKIM" | grep -qi 'p='; then
  report ok "DKIM (brevo selector)" "public key published"
else
  report no "DKIM (brevo selector)" "missing — domain not authenticated"
fi

# 6. DMARC — start at p=none, tighten only after Brevo reports clean.
DMARC=$(query "_dmarc.$DOMAIN" TXT)
if echo "$DMARC" | grep -qi 'v=DMARC1'; then
  POLICY=$(echo "$DMARC" | grep -oi 'p=[a-z]*' | head -1)
  report ok "DMARC" "$POLICY"
else
  report no "DMARC" "missing"
fi

# 7. Website records — these were already live; guard against the mail work
#    accidentally clobbering them.
A=$(query "$DOMAIN" A)
[ -n "$A" ] && report ok "A (apex -> Netlify)" "$(echo "$A" | tr '\n' ' ')" \
             || report no "A (apex -> Netlify)" "missing"
WWW=$(query "www.$DOMAIN" CNAME)
[ -n "$WWW" ] && report ok "CNAME (www)" "$(echo "$WWW" | tr '\n' ' ')" \
              || report no "CNAME (www)" "missing"

echo "-------------------------------------------------------------"
echo "  $PASS passed, $FAIL outstanding"
echo
[ "$FAIL" -eq 0 ]
