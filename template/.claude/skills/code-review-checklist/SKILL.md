---
name: code-review-checklist
description: Review a diff for correctness, security, contracts, tests, design and readability, and report verified, prioritised findings. Use for /review, the reviewer agent, or before declaring work done.
---

# Code review checklist

Read the whole changed files, not only hunks. Verify each finding before reporting it.

## Correctness
- Logic matches the requirement; edge cases (empty, null, max, duplicate, unicode, time zones).
- Error paths handled; resources closed; transactions correct; concurrency/races.
- Off-by-one, integer overflow, float money, wrong equality.

## Security (`security-audit` for sensitive code)
- Input validated at the boundary; queries parameterised; output encoded.
- Authorization incl. object ownership; no secrets or personal data in code/logs.

## Contracts
- Public API, events, DB schema, config keys: backwards compatible or flagged.
- Migrations reversible; feature flags default safe.

## Tests
- A test fails without the change; edge and error cases covered; no sleeps or order dependence.

## Design (ponytail)
- Fits existing patterns; no speculative abstraction; no dead or duplicated code; no unused deps.

## Readability
- Names say what, comments say why; consistent with surrounding code.

## Output
MUST-FIX (would cause a bug, vulnerability or broken contract) / SHOULD-FIX / NIT (max 3).
Each: `path:line - problem - failure scenario - fix`.
