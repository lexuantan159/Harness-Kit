---
description: Multi-panel review of a pull request with merge score; optionally post the summary to Teams
argument-hint: "<PR number | URL> [--teams]"
---

Review pull request: $ARGUMENTS

1. Delegate to `@pr-review` with the PR reference.
2. Show the merge score, verdict and MUST-FIX list.
3. Only if `--teams` was given and the `teams` MCP server is connected: post the summary with
   `send_review_summary`. Otherwise do not send anything outside this machine.
4. Do not comment on or approve the PR on the hosting service unless the user explicitly asks.
