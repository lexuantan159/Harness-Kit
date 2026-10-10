---
mode: agent
description: Self-review the current branch with the reviewer agent before asking humans
---

Follow the workflow in [.claude/commands/review.md](../../.claude/commands/review.md) exactly.

- `$ARGUMENTS` in that file means: ${input:args:Arguments for /review}
- "`@<agent>`" means: act in the role defined in `.claude/agents/<agent>.md` for that step.
- Skills referenced by name are in `.claude/skills/<name>/SKILL.md`.
