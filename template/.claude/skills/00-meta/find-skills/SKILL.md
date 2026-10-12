---
name: find-skills
description: Find the right skill for a task - search the local .claude/skills first, then (optionally) the public skills registry. Use when no skill obviously fits, or the user asks "is there a skill for X".
---

# Find skills

## 1. Search locally (always first)
```sh
grep -ril "<keyword>" .claude/skills/*/SKILL.md          # full text
grep -h "^description:" .claude/skills/*/SKILL.md         # all one-line descriptions
```
Match on the task's verb (plan, debug, review, deploy...) and its object (API, form, cache, DB...).
Read the top 1-2 candidates' SKILL.md fully before choosing.

## 2. Search the public registry (only if nothing local fits)
If Node is available, the open skills registry can be searched without installing anything:
```sh
npx skills find <keyword>
```
Show the user the candidates (name, source, one-line description). **Do not install** a third-party
skill without the user's approval: it is code and instructions from outside the project.
After approval: `npx skills add <source> --skill <name>` into `.claude/skills/`, then read it fully
and check it does not conflict with CLAUDE.md rules.

## 3. Nothing fits
Proceed without a skill, and if the procedure is likely to repeat, propose creating one with
`skill-creator`.
