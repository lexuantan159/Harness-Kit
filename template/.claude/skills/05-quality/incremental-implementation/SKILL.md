---
name: incremental-implementation
description: Use for /code and any multi-step implementation or change touching more than one file. Implements a plan in small, verified increments - one step, test, verify, green - instead of one big change.
---

# Incremental Implementation

Deliver an approved plan one verifiable step at a time, keeping the build green throughout.

<HARD-GATE>
Do NOT start the next step while the build or the current step's tests are red. If a step turns
out bigger than planned or the plan is wrong, stop and update the plan with the user rather than
improvising.
</HARD-GATE>

## Anti-Pattern: "I'll Do It All, Then Test"

One big change fails in many places at once, and the failures hide each other. Small steps make
every failure point to one change.

## Checklist

For each plan step:

1. **Restate** the step, its files and its verify command
2. **Test first** if behaviour changes (`test-driven-development`)
3. **Implement** the minimum for this step only
4. **Verify** - build + the step's tests
5. **Checkpoint** - tree green and coherent; tick the step

After all steps: full verify commands, review, session summary.

## The Process

- **Implement:** resist touching the next step, even when it is "just one line".
- **Verify:** red -> fix now, at most 3 attempts, then stop and report the failure verbatim.
- **Checkpoint:** commit per step only if the user wants per-step commits.
- **Follow-ups:** keep a running list of things you noticed but did not do; report them at the end.

## Key Principles

- Never leave the build red between steps
- One step, one concern
- The plan is the contract - change it with the user, not silently
- Bounded retries (3), then escalate

## Transition

After the last step: full verify commands from CLAUDE.md, then `@reviewer` on the whole diff
(`/code` step 5), then the session summary in `docs/ai/sessions/`.
