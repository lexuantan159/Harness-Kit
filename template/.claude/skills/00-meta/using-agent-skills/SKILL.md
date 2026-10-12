---
name: using-agent-skills
description: Use at the start of any task (injected at session start). Explains how to pick and apply the skills in .claude/skills before acting.
---

# Using agent skills

Skills are tested procedures. Using the right one beats improvising.

<HARD-GATE>
Do NOT start a task before checking whether a skill covers it. When one does, its Checklist and
any HARD-GATE in it are mandatory; skip a step only with a stated reason.
</HARD-GATE>

## Anti-Pattern: "Too Small For A Skill"

Small tasks are where skipped steps (no reproduction, no failing test, no approval) cost the most
rework.

## Checklist

1. **Classify** the task: idea, planning, exploration, backend, frontend, quality (bug, review,
   test, perf, security) or delivery (git, CI, docs, deploy)
2. **Pick** the matching skill(s) from `.claude/skills/README.md`; if unsure, use `find-skills`
3. **Announce** in one line which skill you are applying, then follow it
4. **Propose** the next skill or command its Transition section names; run a command only when
   the user asks

## Default routes

| Situation | Skill / command |
|---|---|
| Vague idea | `brainstorming` -> `idea-assessment` (`/assess`) |
| Ticket to implement | `requirements-analysis` -> `writing-plans` (`/plan`) -> `incremental-implementation` (`/code`) |
| Bigger feature | `brainstorming` -> `spec-driven-development` (`/spec`) |
| Unknown code | `scout`, `legacy-assessment`, `ast-grep` |
| Bug | `debugging` -> `bug-fixing` (`/fix`) |
| New behaviour | `test-driven-development` |
| Before done | `code-review-checklist` (`/review`), `security-audit` for sensitive code |

## Key Principles

- Ponytail minimal-code rules are always on (`ponytail`)
- Read `docs/ai/context/ARCHITECTURE.md` before changing code
- Verify with the commands in CLAUDE.md before claiming done
- A skill's HARD-GATE is never optional
