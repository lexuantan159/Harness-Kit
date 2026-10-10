---
mode: agent
description: Spec-driven development - Specify -> Plan -> Tasks -> Implement -> Converge, with approval gates
---

Follow the workflow in [.claude/commands/spec.md](../../.claude/commands/spec.md) exactly.

- `$ARGUMENTS` in that file means: ${input:args:Arguments for /spec}
- "`@<agent>`" means: act in the role defined in `.claude/agents/<agent>.md` for that step.
- Skills referenced by name are in `.claude/skills/<name>/SKILL.md`.
