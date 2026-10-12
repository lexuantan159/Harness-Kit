---
name: code-review-checklist
description: Use for /review, the reviewer agent, or before declaring work done. Reviews a diff for correctness, security, contracts, tests, design and readability, and reports verified, prioritised findings as an Issue List.
---

# Code Review Checklist

Find the problems in a diff that would hurt in production, and report only what you verified.

## Anti-Pattern: "Reviewing The Hunk"

Reading only the changed lines misses broken callers, missing error paths and contract changes.
Read the whole changed files and the code that calls them.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` for layering rules and conventions
2. **Scope** - get the full diff (`git diff <base>...HEAD` plus uncommitted changes) and the
   acceptance criteria
3. **Review in order** - correctness, security, contracts, tests, design, readability
4. **Verify** each finding against the code; drop what you cannot substantiate
5. **Report** as an Issue List

## The Process

**Correctness**
- Logic matches the requirement; edge cases (empty, null, max, duplicate, unicode, time zones).
- Error paths handled; resources closed; transactions correct; concurrency/races.
- Off-by-one, integer overflow, float money, wrong equality.

**Security** (`security-audit` for sensitive code, `.claude/references/security.md`)
- Input validated at the boundary; queries parameterised; output encoded.
- Authorization incl. object ownership; no secrets or personal data in code/logs.

**Contracts**
- Public API, events, DB schema, config keys: backwards compatible or flagged.
- Migrations reversible; feature flags default safe.

**Tests** (`.claude/references/testing-patterns.md`)
- A test fails without the change; edge and error cases covered; no sleeps or order dependence.

**Design** (ponytail)
- Fits existing patterns; no speculative abstraction; no dead or duplicated code; no unused deps.

**Readability**
- Names say what, comments say why; consistent with surrounding code.
- No style nits a linter would catch.

**Output** - an Issue List: Critical (bug, vulnerability or broken contract) / Important (must fix
before merge) / Suggestion (optional, non-blocking). Each:
`ISSUE-NNN - path:line - problem - failure scenario - fix`, under
`Verdict: ready | needs changes` (ready = no Critical or Important issues). In `/pr-review`,
Critical and Important count as MUST-FIX and Suggestion as SHOULD-FIX / NIT.

## Key Principles

- Whole files, not hunks
- Every finding has a concrete failure scenario
- Verified findings only
- Severity reflects production impact, not taste

## Transition

The Issue List goes to `@coder` when the verdict is "needs changes"; changes on the
`senior-review` mandatory list also go to `@senior-reviewer`.
