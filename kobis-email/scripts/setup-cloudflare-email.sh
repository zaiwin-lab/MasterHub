#!/usr/bin/env bash
# Enable Cloudflare Email Routing for kobisbhd.com and forward the four
# role addresses to the verified destination.
#
# Requires: CF_API_TOKEN with, scoped to kobisbhd.com only —
#   Zone   > Zone            > Read
#   Zone   > DNS             > Edit
#   Zone   > Email Routing Rules > Edit
#   Account> Email Routing Addresses > Edit
#
# Usage: CF_API_TOKEN=xxx ./setup-cloudflare-email.sh
#
# Idempotent: re-running skips anything that already exists.

set -euo pipefail

ZONE_NAME="kobisbhd.com"
DESTINATION="zaiwin@gmail.com"
ADDRESSES=(outreach admin setiausaha chairman)

# Hard guard: this script must never touch the legacy Titan-hosted domain.
FORBIDDEN_ZONE="kobisberhad.com"

API="https://api.cloudflare.com/client/v4"
: "${CF_API_TOKEN:?CF_API_TOKEN is not set}"

cf() {
  local method=$1 path=$2 body=${3:-}
  local args=(-sS -X "$method" "$API$path"
              -H "Authorization: Bearer $CF_API_TOKEN"
              -H "Content-Type: application/json")
  [[ -n $body ]] && args+=(--data "$body")
  curl "${args[@]}"
}

# jq is not guaranteed to be present; use node for JSON parsing.
jget() { node -e '
  let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
    let j; try { j=JSON.parse(s) } catch(e) { console.error("bad json: "+s.slice(0,300)); process.exit(1) }
    if (j.success === false) {
      console.error("Cloudflare API error: " + JSON.stringify(j.errors));
      process.exit(1);
    }
    const path = process.argv[1].split(".").filter(Boolean);
    let v = j;
    for (const p of path) v = v == null ? v : v[p];
    if (v === undefined || v === null) { console.log(""); }
    else if (typeof v === "object") console.log(JSON.stringify(v));
    else console.log(v);
  })' "$1"; }

step() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }

if [[ "$ZONE_NAME" == "$FORBIDDEN_ZONE" ]]; then
  echo "Refusing to operate on $FORBIDDEN_ZONE" >&2; exit 1
fi

step "Resolving zone $ZONE_NAME"
ZONE_JSON=$(cf GET "/zones?name=$ZONE_NAME")
ZONE_ID=$(printf '%s' "$ZONE_JSON" | jget "result.0.id")
ACCOUNT_ID=$(printf '%s' "$ZONE_JSON" | jget "result.0.account.id")
if [[ -z $ZONE_ID ]]; then
  echo "Zone $ZONE_NAME not found, or the token lacks Zone:Read on it." >&2; exit 1
fi
echo "zone_id=$ZONE_ID"
echo "account_id=$ACCOUNT_ID"

step "Enabling Email Routing (adds MX + SPF automatically)"
ROUTING=$(cf GET "/zones/$ZONE_ID/email/routing")
ENABLED=$(printf '%s' "$ROUTING" | jget "result.enabled" || echo "")
if [[ "$ENABLED" == "true" ]]; then
  echo "already enabled — skipping"
else
  cf POST "/zones/$ZONE_ID/email/routing/enable" '{}' >/dev/null
  echo "enabled"
fi

step "Registering destination address $DESTINATION"
EXISTING=$(cf GET "/accounts/$ACCOUNT_ID/email/routing/addresses?per_page=50")
if printf '%s' "$EXISTING" | grep -q "\"$DESTINATION\""; then
  echo "already registered"
else
  cf POST "/accounts/$ACCOUNT_ID/email/routing/addresses" \
     "{\"email\":\"$DESTINATION\"}" >/dev/null
  echo "created"
fi

VERIFIED=$(cf GET "/accounts/$ACCOUNT_ID/email/routing/addresses?per_page=50" | node -e '
  let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
    const j=JSON.parse(s);
    const a=(j.result||[]).find(x=>x.email===process.argv[1]);
    console.log(a && a.verified ? "yes" : "no");
  })' "$DESTINATION")

if [[ "$VERIFIED" != "yes" ]]; then
  cat <<EOF

  ACTION NEEDED: Cloudflare has emailed $DESTINATION a verification link.
  That link must be opened before any forwarding will deliver.
  Re-run this script once verified to create the routing rules.

EOF
fi

step "Creating routing rules"
RULES=$(cf GET "/zones/$ZONE_ID/email/routing/rules?per_page=50")
for name in "${ADDRESSES[@]}"; do
  addr="$name@$ZONE_NAME"
  if printf '%s' "$RULES" | grep -q "\"$addr\""; then
    echo "  $addr — rule exists, skipping"
    continue
  fi
  cf POST "/zones/$ZONE_ID/email/routing/rules" "$(cat <<JSON
{
  "name": "$name",
  "enabled": true,
  "matchers": [{"type":"literal","field":"to","value":"$addr"}],
  "actions":  [{"type":"forward","value":["$DESTINATION"]}]
}
JSON
)" >/dev/null
  echo "  $addr -> $DESTINATION"
done

step "Current DNS records for $ZONE_NAME (MX + TXT)"
cf GET "/zones/$ZONE_ID/dns_records?per_page=100" | node -e '
  let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
    const j=JSON.parse(s);
    (j.result||[])
      .filter(r=>["MX","TXT"].includes(r.type))
      .forEach(r=>console.log(`  ${r.type.padEnd(4)} ${r.name}  ${r.content}`));
  })'

step "Done"
echo "Verify externally once DNS propagates:  ./verify-dns.sh"
