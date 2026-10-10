---
mode: agent
description: Multi-panel review of a pull request with merge score; optionally post the summary to Teams
---

Follow the workflow in [.claude/commands/pr-review.md](../../.claude/commands/pr-review.md) exactly.

- `$ARGUMENTS` in that file means: ${input:args:Arguments for /pr-review}
- "`@<agent>`" means: act in the role defined in `.claude/agents/<agent>.md` for that step.
- Skills referenced by name are in `.claude/skills/<name>/SKILL.md`.
