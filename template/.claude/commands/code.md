---
description: Implement an approved plan or task end to end with coder + tester, loop until green, then commit (and PR if asked)
argument-hint: "<plan path | ticket | task description>"
---

Implement: $ARGUMENTS

1. Load the approved plan (`docs/ai/plans/...` or `docs/ai/specs/.../tasks.md`). If there is no
   approved plan and the change is non-trivial, run `/plan` first and stop.
2. Create a branch if on the default branch: `feature/<ticket-or-slug>`.
3. For each step, in order (`incremental-implementation` skill):
   - `@coder` implements the step (tests first when behaviour changes).
   - `@tester` runs the step's verify command and the related tests.
   - Red -> back to `@coder` with `@tester`'s Bug List. Max 3 attempts per step; then stop and log
     to `docs/ai/report/harness-issues.md`.
4. Run the full verify commands from CLAUDE.md (build, test, lint).
5. `@reviewer` on the whole diff. `@coder` fixes the Critical and Important
   issues from its Issue List, then re-run verification (max 3 rounds).
6. Commit with a Conventional Commit message referencing the ticket. Push / open a PR only if the
   user asked (`gh pr create`).
7. Write `docs/ai/sessions/<YYYY-MM-DD>-<slug>.md`: what changed, commands run with results,
   follow-ups. Reply with the same summary.
