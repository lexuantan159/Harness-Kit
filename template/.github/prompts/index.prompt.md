---
mode: agent
description: Generate or refresh the AI context docs (ARCHITECTURE.md, SCHEMA.md, BUSINESS.md) from the code
---

Follow the workflow in [.claude/commands/index.md](../../.claude/commands/index.md) exactly.

- `$ARGUMENTS` in that file means: ${input:args:Arguments for /index}
- "`@<agent>`" means: act in the role defined in `.claude/agents/<agent>.md` for that step.
- Skills referenced by name are in `.claude/skills/<name>/SKILL.md`.
