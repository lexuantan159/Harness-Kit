---
mode: agent
description: Turn a ticket or description into an approved implementation plan with estimates (no code changes)
---

Follow the workflow in [.claude/commands/plan.md](../../.claude/commands/plan.md) exactly.

- `$ARGUMENTS` in that file means: ${input:args:Arguments for /plan}
- "`@<agent>`" means: act in the role defined in `.claude/agents/<agent>.md` for that step.
- Skills referenced by name are in `.claude/skills/<name>/SKILL.md`.
