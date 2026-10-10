---
name: using-agent-skills
description: Meta-skill injected at session start. Explains how to pick and apply the skills in .claude/skills before acting. Use at the start of any task.
---

# Using agent skills

Skills are tested procedures. Using the right one beats improvising.

## Before every task
1. Classify the task: idea, planning, exploration, backend, frontend, quality (bug, review,
   test, perf, security) or delivery (git, CI, docs, deploy).
2. Pick the matching skill(s) from `.claude/skills/README.md`. If unsure, use `find-skills`.
3. Announce in one line which skill you are applying, then follow it. A skill's steps are not
   optional; skip one only with a stated reason.

## Default routes
| Situation | Skill / command |
|---|---|
| Vague idea | `brainstorming` -> `idea-assessment` (`/assess`) |
| Ticket to implement | `requirements-analysis` -> `writing-plans` (`/plan`) -> `incremental-implementation` (`/code`) |
| Bigger feature | `spec-driven-development` (`/spec`) |
| Unknown code | `scout`, `legacy-assessment`, `ast-grep` |
| Bug | `debugging` -> `bug-fixing` (`/fix`) |
| New behaviour | `test-driven-development` |
| Before done | `code-review-checklist` (`/review`), `security-audit` for sensitive code |

## Always on
- Ponytail minimal-code rules (see `ponytail`).
- Verify with the commands in CLAUDE.md before claiming done.
- Read `docs/ai/context/ARCHITECTURE.md` before changing code.
