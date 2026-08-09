#!/bin/bash
# One-command Netlify deploy for Client Diagnostic Portal
# Run this from your local machine inside the client-portal/ folder
#
# Auth comes from the environment, never from this file:
#
#   export NETLIFY_AUTH_TOKEN="<your personal access token>"
#   ./deploy.sh
#
# Get a token at https://app.netlify.com/user/applications#personal-access-tokens
# Do not paste it here, and do not commit it anywhere.

set -euo pipefail

SITE_NAME="masterhub-client-portal"
DIR="$(cd "$(dirname "$0")" && pwd)"

if [[ -z "${NETLIFY_AUTH_TOKEN:-}" ]]; then
  echo "✗ NETLIFY_AUTH_TOKEN is not set."
  echo "  export NETLIFY_AUTH_TOKEN=\"<your token>\" and run this again."
  exit 1
fi

echo "→ Checking netlify-cli..."
if ! command -v netlify &>/dev/null; then
  echo "  Installing netlify-cli..."
  npm install -g netlify-cli
fi

echo "→ Deploying site: $SITE_NAME"
netlify deploy \
  --dir "$DIR" \
  --site "$SITE_NAME" \
  --prod \
  --message "Client Diagnostic Portal deploy" 2>&1 || \
netlify deploy \
  --dir "$DIR" \
  --prod \
  --message "Client Diagnostic Portal deploy"

echo ""
echo "✓ Done. Your portal is live."
