"""
Composio starter — connects Claude (Anthropic) to 500+ apps via Composio.

Usage:
    1. Set COMPOSIO_API_KEY and ANTHROPIC_API_KEY in .env
    2. Run: python setup.py
    3. Follow the login link to connect your first app (e.g. Gmail, HubSpot, Slack)
"""

import os
from dotenv import load_dotenv

load_dotenv()

COMPOSIO_API_KEY = os.getenv("COMPOSIO_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


def verify_setup():
    from composio import Composio
    from composio_anthropic import AnthropicProvider

    if not COMPOSIO_API_KEY:
        print("[!] COMPOSIO_API_KEY not set. Get yours at: https://app.composio.dev/")
        print("    Then add it to your .env file:")
        print("    COMPOSIO_API_KEY=your_key_here")
        return False

    if not ANTHROPIC_API_KEY:
        print("[!] ANTHROPIC_API_KEY not set. Get yours at: https://console.anthropic.com/")
        print("    Then add it to your .env file:")
        print("    ANTHROPIC_API_KEY=your_key_here")
        return False

    client = Composio(api_key=COMPOSIO_API_KEY)
    print("Composio SDK: OK")
    print("AnthropicProvider: OK")
    print()
    print("Ready to connect apps. Visit https://app.composio.dev/ to:")
    print("  - Connect Gmail, HubSpot, Slack, GitHub, Notion, and 500+ more")
    print("  - Manage OAuth tokens per client/user")
    print("  - Browse available actions for each app")
    return True


if __name__ == "__main__":
    verify_setup()
