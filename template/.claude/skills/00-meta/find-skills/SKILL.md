---
name: find-skills
description: Use when no skill obviously fits a task, or the user asks "is there a skill for X". Finds the right skill - searches the local .claude/skills first, then (optionally) the public skills registry.
---

# Find Skills

Find an existing procedure before improvising one.

<HARD-GATE>
Do NOT install a third-party skill without the user's approval: it is code and instructions from
outside the project.
</HARD-GATE>

## Anti-Pattern: "Grab The First Match"

A skill chosen by its name alone may not fit the task. Read the top candidates fully first.

## Checklist

1. **Search locally** (always first)
2. **Read** the top 1-2 candidates' SKILL.md fully before choosing
3. **Search the public registry** only if nothing local fits
4. **Nothing fits** - proceed without a skill, propose one if the procedure will repeat

## The Process

**Local search**
```sh
grep -ril "<keyword>" .claude/skills/*/SKILL.md          # full text
grep -h "^description:" .claude/skills/*/SKILL.md         # all one-line descriptions
```
In the harness kit itself skills are one level deeper (`.claude/skills/*/*/SKILL.md`). Match on the
task's verb (plan, debug, review, deploy...) and its object (API, form, cache, DB...).

**Public registry** - if Node is available, search without installing anything:
```sh
npx skills find <keyword>
```
Show the user the candidates (name, source, one-line description). After approval:
`npx skills add <source> --skill <name>` into `.claude/skills/`, then read it fully and check it
does not conflict with CLAUDE.md rules.

## Key Principles

- Local before public
- Read before choosing
- Never install without approval

## Transition

Apply the chosen skill (`using-agent-skills`). If the procedure is likely to repeat and nothing
fits, propose creating one with `skill-creator`.
