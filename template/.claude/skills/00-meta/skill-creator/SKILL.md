---
name: skill-creator
description: Use when a workflow keeps recurring, or the user asks to add or edit a skill. Creates or improves a project skill (SKILL.md) so agents repeat a procedure reliably.
---

# Skill Creator

Capture a recurring procedure as a skill that agents trigger at the right time and follow
reliably.

## Anti-Pattern: "A Skill For Everything"

One-off tasks and generic textbook advice do not need a skill. A skill is worth it when the
procedure recurs, has steps people get wrong, or encodes project knowledge an agent cannot infer
from code.

## Checklist

1. **Decide** whether a skill is worth it (above)
2. **Search** for an existing skill to extend instead (`find-skills`)
3. **Write** SKILL.md from the template below
4. **Test** it on a realistic task and fix the steps the agent misread
5. **Register** it in `.claude/skills/README.md`

## The Process

**Layout**
```
.claude/skills/<kebab-name>/
  SKILL.md          required
  references/*.md   optional detail loaded only when needed
  scripts/*         optional helpers the skill tells the agent to run
```
In the harness kit itself, skills sit one level deeper in a stage folder
(`skills/00-meta` ... `skills/06-delivery`, see `.claude/skills/README.md`); the installer
flattens them, so always refer to a skill by name. Never start a skill name with `NN-`: the
installer would read it as a stage folder.

**SKILL.md template** - model it on `brainstorming`. Drop sections that do not apply, but keep
the order.
```markdown
---
name: <kebab-name>            # must match the folder
description: Use when/before <trigger situations, user phrases>. <What it does and produces>.
---
# <Title>
<1-2 lines: purpose and the outcome>

<HARD-GATE>                   (only if an action must wait or must never be taken by an agent:
<what must not happen until when>   no code before approval, no fix before a reproduction, no deploy,
</HARD-GATE>                  no data deletion; standing rules go in Key Principles)

## Anti-Pattern: "<the tempting shortcut>"
## Checklist        (numbered steps that MUST be done in order; step 1 reads
                     docs/ai/context/ARCHITECTURE.md when project context matters)
## The Process      (how to do each step well: questions to ask, commands, paths)
## Key Principles   (3-5 one-line rules)
## Transition       (the skill, command or agent that comes next; output path)
```
Link the matching `.claude/references/*.md` checklist instead of copying it.

## Key Principles

- The description decides when the skill triggers: name the situations and phrases explicitly
- Under ~150 lines; move detail into `references/`
- Concrete commands and paths beat advice
- Tested on a real task before it is trusted

## Transition

Add the skill to `.claude/skills/README.md`. Skills created in a project are project-owned and
survive harness updates; propose generally useful ones upstream to the harness kit.
