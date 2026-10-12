---
name: incremental-implementation
description: Implement a plan in small, verified increments - one step, test, verify, commit-ready state - instead of one big change. Use for /code and any multi-step implementation.
---

# Incremental implementation

For each plan step:
1. **Restate** the step, its files and its verify command.
2. **Test first** if behaviour changes (`test-driven-development`).
3. **Implement** the minimum for this step only. Resist touching the next step.
4. **Verify** - build + the step's tests. Red -> fix now (max 3 attempts, then stop and report).
5. **Checkpoint** - the tree is green and coherent; tick the step; commit if the user wants
   per-step commits.

After all steps: full verify commands, review, session summary.

Rules
- Never leave the build red between steps.
- If a step turns out bigger than planned or the plan is wrong, stop and update the plan with the
  user rather than improvising.
- Keep a running list of follow-ups you noticed but did not do; report them at the end.
