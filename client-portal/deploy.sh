#!/bin/bash
# One-command Netlify deploy for Client Diagnostic Portal
# Run this from your local machine inside the client-portal/ folder
#
# Requires a Netlify personal access token in the environment:
#   export NETLIFY_AUTH_TOKEN="your-token"
#   ./deploy.sh
#
# Create a token at: https://app.netlify.com/user/applications#personal-access-tokens
# Never hardcode the token in this file — this repository is public.

set -euo pipefail

if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  echo "✗ NETLIFY_AUTH_TOKEN is not set."
  echo "  export NETLIFY_AUTH_TOKEN=\"your-token\" and re-run this script."
  exit 1
fi

SITE_NAME="masterhub-client-portal"
DIR="$(cd "$(dirname "$0")" && pwd)"

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
  --message "Client Diagnostic Portal — deploy" 2>&1 || \
netlify deploy \
  --dir "$DIR" \
  --prod \
  --message "Client Diagnostic Portal — deploy"

echo ""
echo "✓ Done. Your portal is live."
