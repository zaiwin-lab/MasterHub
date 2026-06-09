"""
Example: Claude agent that reads Gmail and updates HubSpot via Composio.

Prerequisites:
    - COMPOSIO_API_KEY and ANTHROPIC_API_KEY set in .env
    - Gmail and HubSpot connected at https://app.composio.dev/
"""

import os
from dotenv import load_dotenv
import anthropic
from composio import Composio, Action
from composio_anthropic import AnthropicProvider

load_dotenv()

composio = Composio(api_key=os.getenv("COMPOSIO_API_KEY"))
anthropic_client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
provider = AnthropicProvider(client=anthropic_client)


def run_agent(task: str, user_id: str = "default"):
    tools = composio.get_tools(
        provider=provider,
        apps=["gmail", "hubspot"],
        # Optional: scope to specific actions
        # actions=[Action.GMAIL_LIST_THREADS, Action.HUBSPOT_GET_CRM_OBJECTS],
        user_id=user_id,
    )

    messages = [{"role": "user", "content": task}]

    while True:
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            for block in response.content:
                if hasattr(block, "text"):
                    print(block.text)
            break

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = composio.handle_tool_calls(provider=provider, response=response, user_id=user_id)
            messages.append({"role": "user", "content": tool_results})


if __name__ == "__main__":
    run_agent("Check my last 3 emails and summarize any leads I should follow up on in HubSpot.")
