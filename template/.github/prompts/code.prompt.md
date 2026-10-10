---
mode: agent
description: Implement an approved plan or task end to end with coder + tester, loop until green, then commit (and PR if asked)
---

Follow the workflow in [.claude/commands/code.md](../../.claude/commands/code.md) exactly.

- `$ARGUMENTS` in that file means: ${input:args:Arguments for /code}
- "`@<agent>`" means: act in the role defined in `.claude/agents/<agent>.md` for that step.
- Skills referenced by name are in `.claude/skills/<name>/SKILL.md`.
