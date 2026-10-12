---
name: writing-plans
description: Use after requirements are clear and before editing code (/plan, planner agent, after brainstorming). Writes an implementation plan of small, independently verifiable steps with estimates.
---

# Writing Plans

Turn agreed requirements into steps small enough that each one can be verified on its own.

<HARD-GATE>
Do NOT edit code while writing a plan. The plan ends with a stop for the user's approval.
</HARD-GATE>

## Anti-Pattern: "Step 1: Implement The Feature"

Steps that are too big cannot be verified, estimated or reviewed. If a step has no verify
command, it is not a step yet.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md`; map the area with `scout`
2. **Goal and acceptance criteria** from `requirements-analysis` (or the approved design/spec)
3. **Relevant code** - files and the existing pattern to copy
4. **Steps** - each with files, verify command and estimate
5. **Risks and open questions**
6. **Save and stop** for approval

## The Process

**Template**
```
Goal: <1-2 sentences>
Acceptance criteria:
- ...
Relevant code:
- path - why it matters
Plan:
1. <step> - files: ... - verify: <command/check> - est: S|M|L
Risks / open questions:
- ...
```

**Rules for steps**
- Each step leaves the build green and is verifiable on its own.
- Order: data/contract changes -> core logic (with tests) -> integration -> UI -> docs.
- Name the exact files and the existing pattern to copy.
- Tests are part of the step that changes behaviour, not a final step.
- More than ~8 steps -> split into separate tasks/PRs.
- Include migration, feature flag or rollback steps when data or public behaviour changes.

**Estimates** - S < 1h, M ~ half day, L ~ 1 day. Anything bigger is not a step - split it.

## Key Principles

- Every step has a verify command
- Copy an existing pattern before inventing one
- Tests live inside the step
- Small enough to review, big enough to matter

## Transition

Save to `docs/ai/plans/<ticket-or-slug>.md` (or the path the caller gives) and stop for
approval. Risky scope -> `senior-review` first. Approved -> `/code`.
