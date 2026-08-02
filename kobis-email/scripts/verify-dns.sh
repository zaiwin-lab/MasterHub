#!/usr/bin/env bash
# Independently verify the email posture of kobisbhd.com from public DNS.
# No credentials required. Uses DNS-over-HTTPS so it works without dig.
#
# Usage: ./verify-dns.sh [domain]

set -uo pipefail
DOMAIN="${1:-kobisbhd.com}"

q() { # q <name> <type> -> one record per line
  curl -sS -m 20 -H 'accept: application/dns-json' \
    "https://dns.google/resolve?name=$1&type=$2" |
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
    try{const j=JSON.parse(s);(j.Answer||[]).forEach(a=>console.log(a.data))}catch(e){}
  })'
}

pass() { printf "  \033[32mPASS\033[0m  %s\n" "$1"; }
fail() { printf "  \033[31mFAIL\033[0m  %s\n" "$1"; FAILED=1; }
warn() { printf "  \033[33mWARN\033[0m  %s\n" "$1"; }

FAILED=0
echo "Email posture for $DOMAIN"
echo

echo "MX (inbound routing)"
MX=$(q "$DOMAIN" MX)
if [[ -z $MX ]]; then
  fail "no MX records — Email Routing is not enabled, mail will bounce"
elif grep -q "mx.cloudflare.net" <<<"$MX"; then
  pass "Cloudflare Email Routing MX present"
  sed 's/^/        /' <<<"$MX"
else
  warn "MX present but not Cloudflare:"
  sed 's/^/        /' <<<"$MX"
fi
echo

echo "SPF (authorises senders)"
SPF=$(q "$DOMAIN" TXT | grep -i "v=spf1" || true)
COUNT=$(grep -c . <<<"${SPF:-}" || true)
if [[ -z $SPF ]]; then
  fail "no SPF record"
elif (( COUNT > 1 )); then
  fail "$COUNT SPF records — only ONE is permitted, receivers will fail the check"
  sed 's/^/        /' <<<"$SPF"
else
  echo "        $SPF"
  grep -q "_spf.mx.cloudflare.net" <<<"$SPF" \
    && pass "Cloudflare Email Routing include present" \
    || warn "missing include:_spf.mx.cloudflare.net (inbound forwarding)"
  grep -q "spf.brevo.com" <<<"$SPF" \
    && pass "Brevo include present" \
    || fail "missing include:spf.brevo.com — Brevo campaigns will fail SPF"
fi
echo

echo "DKIM (signs outbound mail)"
DKIM=$(q "brevo._domainkey.$DOMAIN" TXT)
[[ -n $DKIM ]] && pass "brevo._domainkey present" \
               || fail "no brevo._domainkey record — Brevo domain not authenticated"
echo

echo "Brevo domain verification"
BCODE=$(q "$DOMAIN" TXT | grep -i "brevo-code" || true)
[[ -n $BCODE ]] && pass "brevo-code present" \
                || warn "no brevo-code TXT (may already be verified, or not yet added)"
echo

echo "DMARC (policy)"
DMARC=$(q "_dmarc.$DOMAIN" TXT | grep -i "v=DMARC1" || true)
if [[ -z $DMARC ]]; then
  fail "no DMARC record — required by Gmail/Yahoo bulk sender rules"
else
  echo "        $DMARC"
  pass "DMARC published"
fi
echo

if (( FAILED )); then
  echo "Result: NOT ready to send."
  exit 1
fi
echo "Result: all checks passed."
