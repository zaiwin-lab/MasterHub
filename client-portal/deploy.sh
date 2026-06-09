#!/bin/bash
# One-command Netlify deploy for Client Diagnostic Portal
# Run this from your local machine inside the client-portal/ folder

set -e

TOKEN="nfp_Yvzgo3nSLWaERiaRpqrFW1ptM3CWGip99239"
SITE_NAME="masterhub-client-portal"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "→ Checking netlify-cli..."
if ! command -v netlify &>/dev/null; then
  echo "  Installing netlify-cli..."
  npm install -g netlify-cli
fi

echo "→ Creating & deploying site: $SITE_NAME"
NETLIFY_AUTH_TOKEN=$TOKEN netlify deploy \
  --dir "$DIR" \
  --site "$SITE_NAME" \
  --prod \
  --auth "$TOKEN" \
  --message "Client Diagnostic Portal — initial deploy" 2>&1 || \
NETLIFY_AUTH_TOKEN=$TOKEN netlify deploy \
  --dir "$DIR" \
  --prod \
  --auth "$TOKEN" \
  --message "Client Diagnostic Portal — initial deploy"

echo ""
echo "✓ Done. Your portal is live."
