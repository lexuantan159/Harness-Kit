---
name: writing-plans
description: Write an implementation plan of small, independently verifiable steps with estimates. Use after requirements are clear and before editing code (/plan, planner agent).
---

# Writing plans

## Template
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

## Rules for steps
- Each step leaves the build green and is verifiable on its own.
- Order: data/contract changes -> core logic (with tests) -> integration -> UI -> docs.
- Name the exact files and the existing pattern to copy.
- Tests are part of the step that changes behaviour, not a final step.
- More than ~8 steps -> split into separate tasks/PRs.
- Include migration, feature flag or rollback steps when data or public behaviour changes.

## Estimates
S < 1h, M ~ half day, L ~ 1 day. Anything bigger is not a step - split it.
