---
name: skill-creator
description: Create or improve a project skill (SKILL.md) so agents repeat a procedure reliably. Use when a workflow keeps recurring, or the user asks to add/edit a skill.
---

# Skill creator

## When a skill is worth it
A procedure that recurs, has steps people get wrong, or encodes project knowledge an agent
cannot infer from code. One-off tasks do not need a skill.

## Layout
```
.claude/skills/<kebab-name>/
  SKILL.md          required
  references/*.md   optional detail loaded only when needed
  scripts/*         optional helpers the skill tells the agent to run
```

## SKILL.md template
```markdown
---
name: <kebab-name>            # must match the folder
description: <what it does>. Use when <trigger situations, user phrases>.
---
# <Title>
## When to use / not use
## Steps            (numbered, imperative, each verifiable)
## Checklist        (what "done" means)
## Pitfalls         (mistakes seen in this project)
```

## Rules
- The description decides when the skill triggers: name the situations and phrases explicitly.
- Under ~150 lines; move detail into `references/`.
- Concrete commands and paths beat advice. No generic textbook content.
- Test it: run a realistic task with the skill and fix the steps the agent misread.
- Add the skill to `.claude/skills/README.md`. Skills created in a project are project-owned;
  propose generally useful ones upstream to the harness kit.
