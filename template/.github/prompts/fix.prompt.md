---
mode: agent
description: Fix a bug - investigate, reproduce with a failing regression test, fix the root cause, verify, PR
---

Follow the workflow in [.claude/commands/fix.md](../../.claude/commands/fix.md) exactly.

- `$ARGUMENTS` in that file means: ${input:args:Arguments for /fix}
- "`@<agent>`" means: act in the role defined in `.claude/agents/<agent>.md` for that step.
- Skills referenced by name are in `.claude/skills/<name>/SKILL.md`.
