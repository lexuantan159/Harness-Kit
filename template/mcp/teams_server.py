"""MCP server that posts notifications to a Microsoft Teams channel via an incoming webhook.

Run by Claude Code from .mcp.json:  python mcp/teams_server.py
Config: TEAMS_WEBHOOK_URL in mcp/.env (Teams "Workflows" webhook or legacy incoming webhook).
"""

import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

load_dotenv(Path(__file__).with_name(".env"))

mcp = FastMCP("teams")


def _card(title: str, body: list[dict]) -> dict:
    return {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                    "type": "AdaptiveCard",
                    "version": "1.4",
                    "body": [{"type": "TextBlock", "text": title, "weight": "Bolder", "size": "Medium", "wrap": True}, *body],
                },
            }
        ],
    }


def _post(payload: dict) -> str:
    url = os.getenv("TEAMS_WEBHOOK_URL")
    if not url:
        return "TEAMS_WEBHOOK_URL is not set in mcp/.env - nothing was sent."
    response = httpx.post(url, json=payload, timeout=15)
    if response.status_code >= 300:
        return f"Teams webhook returned HTTP {response.status_code}: {response.text[:200]}"
    return "Sent to Teams."


@mcp.tool()
def send_teams_message(title: str, text: str) -> str:
    """Post a simple message (title + markdown text) to the configured Teams channel."""
    return _post(_card(title, [{"type": "TextBlock", "text": text, "wrap": True}]))


@mcp.tool()
def send_review_summary(pr: str, score: int, verdict: str, summary: str, must_fix: list[str], url: str = "") -> str:
    """Post a PR review summary (merge score, verdict, must-fix items) to the configured Teams channel."""
    body = [
        {"type": "FactSet", "facts": [{"title": "Merge score", "value": f"{score}/100"}, {"title": "Verdict", "value": verdict}]},
        {"type": "TextBlock", "text": summary, "wrap": True},
    ]
    if must_fix:
        body.append({"type": "TextBlock", "text": "**Must fix**\n\n" + "\n".join(f"- {item}" for item in must_fix), "wrap": True})
    if url:
        body.append({"type": "TextBlock", "text": f"[Open PR]({url})", "wrap": True})
    return _post(_card(f"PR review: {pr}", body))


if __name__ == "__main__":
    mcp.run()
