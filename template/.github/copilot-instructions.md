# Copilot instructions - {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

Stack: {{STACK}}. Build: `{{BUILD_CMD}}`. Test: `{{TEST_CMD}}`. Lint: `{{LINT_CMD}}`.

Follow `AGENTS.md` (rules and agent roles). Before working on code read
`docs/ai/context/ARCHITECTURE.md`; for business rules read `docs/ai/context/BUSINESS.md`.

- Reusable procedures are in `.claude/skills/<name>/SKILL.md` - read the matching one before a task
  (index: `.claude/skills/README.md`).
- Role definitions are in `.claude/agents/*.md`; when a prompt says "act as @coder", follow that file.
- Write the minimum code (YAGNI -> reuse -> stdlib -> existing dependency -> new code). No new
  dependencies without asking.
- Reproduce bugs with a failing test before fixing. Run build and tests before saying done.
- Never commit secrets; credentials live in `mcp/.env` (git-ignored).
