---
name: senior-review
description: Use for risky changes and as the gate in /plan, /spec and /review. Runs an independent senior review gate (Approve / Revise / Reject) on a plan or change, at most 3 rounds, escalating to a human if it does not converge.
---

# Senior Review Gate

Get an unbiased verdict on a risky plan or change before it goes further.

<HARD-GATE>
Do NOT pass the author's summary or opinion to `@senior-reviewer` - only the artefact and the
acceptance criteria. Where the calling command requires Approve (`/spec` Plan phase), do not
proceed without it or without the human's explicit decision after escalation.
</HARD-GATE>

## Anti-Pattern: "It's Fine, I Wrote It"

Self-approval and briefed reviewers both confirm what the author already believes. Independence
is the point of the gate.

## Checklist

1. **Decide** whether the gate is mandatory (list below)
2. **Submit** the artefact (plan path or diff range) and the acceptance criteria
3. **Act on the verdict** as the calling command says (round N <= 3)
4. **Escalate** after round 3 without Approve

## The Process

**Mandatory for:** auth/permissions, payments/money, personal data, data migrations/deletion,
public API changes, infrastructure/security config.

**Verdicts:**
- **Approve** -> continue.
- **Revise** -> apply every required change (or explain why one is wrong), then re-submit with
  the round number and the previous required changes.
- **Reject** -> stop; present the reviewer's reasoning and alternative to the user.

**Per command:**
- `/spec` (Plan phase): loop until Approve, at most 3 rounds.
- `/plan`: one round; apply the required changes, then hand the plan to the user for approval.
- `/review`: report the verdict with the review; change nothing unless the user asks.

**Escalation** - after round 3 without Approve, append to `docs/ai/report/harness-issues.md`:
```
## <YYYY-MM-DD> <slug>
Phase: plan | implement   Rounds: 3   Last verdict: Revise | Reject
Unresolved: ...
```
Then ask the human to decide.

## Key Principles

- Independence - artefact and criteria only
- Every required change is applied or explicitly argued
- Bounded: 3 rounds, then a human decides
- Reject means stop, not retry

## Transition

On Approve, return to the calling command's next step (`/plan` approval, `/spec` Tasks, `/review`
report). On Reject or escalation, the human decides.
