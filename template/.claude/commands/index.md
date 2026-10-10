---
description: Generate or refresh the AI context docs (ARCHITECTURE.md, SCHEMA.md, BUSINESS.md) from the code
argument-hint: "[architecture|schema|business]  (default: all)"
---

Refresh the context documents in `docs/ai/context/`. Scope: $ARGUMENTS (empty = all three).

1. If the `codegraph` MCP server is connected, refresh its index first.
2. Use the `scout` skill to map the repository (build files, modules, entry points, data layer, tests).
3. Delegate in parallel:
   - `@documenter` -> `docs/ai/context/ARCHITECTURE.md` and `docs/ai/context/SCHEMA.md`
   - `@biz-analyst` -> `docs/ai/context/BUSINESS.md`
4. Check the results: every claim cites a path, mermaid blocks are valid, placeholder markers removed.
5. Reply with: files written, the 3-5 most important facts learned, and open questions for the team.
