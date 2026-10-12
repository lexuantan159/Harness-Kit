---
description: Spec-driven development - Specify -> Plan -> Tasks -> Implement -> Converge, with approval gates
argument-hint: "<feature description | path to spec>"
---

Run the `spec-driven-development` skill for: $ARGUMENTS

Phases (stop for user approval after 1, 2 and 3):
1. **Specify** - `docs/ai/specs/<slug>/spec.md`: problem, users, scope / out of scope, acceptance
   criteria (Given/When/Then), non-functional requirements, open questions.
2. **Plan** - `@planner` writes `plan.md`: design, touched modules, data/API changes, risks.
   `@senior-reviewer` reviews it (max 3 rounds).
3. **Tasks** - `tasks.md`: ordered, independently verifiable tasks with verify commands.
4. **Implement** - for each task: `@coder` (TDD) -> `@tester`. Tick the task in `tasks.md`.
5. **Converge** - `@reviewer` on the full diff, `@coder` fixes Critical and Important issues (max 3 loops), check every
   acceptance criterion, then summarise to `docs/ai/sessions/<date>-<slug>.md`.

If a loop hits 3 rounds without converging, append to `docs/ai/report/harness-issues.md`
(date, phase, what kept failing) and ask the human.
