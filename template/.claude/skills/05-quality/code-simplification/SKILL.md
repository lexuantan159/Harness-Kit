---
name: code-simplification
description: Use when code is hard to follow, after a feature works, or when asked to clean up or refactor. Simplifies existing code without changing behaviour - removes duplication, dead code, needless abstraction and nesting.
---

# Code Simplification

Make code easier to read and change while keeping its behaviour exactly the same.

<HARD-GATE>
Do NOT simplify code that tests do not cover. Add characterisation tests first. Behaviour must not
change - if a "simplification" changes behaviour, it is a feature change and needs its own plan.
</HARD-GATE>

## Anti-Pattern: "While I'm Here"

Mixing simplification into a behaviour change makes both hard to review and impossible to revert
separately. Keep them in separate commits.

## Checklist

1. **Safety net** - tests cover the code you will touch
2. **Find** candidates
3. **Simplify, one move at a time**, running tests after each
4. **Stop** when the next change would be a matter of taste
5. Commit separately as `refactor:`

## The Process

- **Find:** dead code (unused functions, params, flags, branches), duplication, deep nesting,
  long functions, one-implementation interfaces, pass-through layers, clever one-liners.
- **Moves:**
  - delete dead code; inline single-use helpers and variables
  - guard clauses instead of nested ifs; early returns
  - replace hand-written loops with stdlib (map/filter/stream/comprehension) when clearer
  - merge duplicates only when they change for the same reason (rule of three)
  - rename for intent
- **Wide changes:** use `ast-grep` for structural codemods across many files.

## Key Principles

- Behaviour preserved, proven by tests
- One move, one test run
- Deleting beats abstracting
- Stop at taste

## Transition

`@reviewer` checks the diff; mention in the summary that behaviour is unchanged and which tests
prove it.
