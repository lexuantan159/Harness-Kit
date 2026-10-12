---
name: bug-fixing
description: Use after debugging has found the root cause (/fix), or when handling a Bug List. Fixes the bug with a regression test and the smallest root-cause change, then verifies nothing else broke.
---

# Bug Fixing

Turn a diagnosed root cause into a verified fix that cannot silently come back.

<HARD-GATE>
Do NOT change production code until a regression test exists that fails for the reported reason
(an assertion failure, not a compile error). If there is no confirmed root cause yet, go back to
the `debugging` skill. For a Bug List item, `@tester`'s failing test is the regression test;
confirm its "likely cause" before fixing.
</HARD-GATE>

## Anti-Pattern: "Make The Error Go Away"

Suppressing the error, widening a catch, adding a sleep/retry to hide a race, or editing the
test's expectation to match the buggy behaviour all leave the defect in place.

## Checklist

1. **Regression test first** - reproduces the bug through the public interface; run it and see it red
2. **Fix the root cause** with the smallest diff
3. **Run** the regression test (green), the module's tests, then the full verify commands
4. **Blast radius** - callers and data already corrupted by the bug
5. **Commit** as the calling command says (push or PR only if the user asks) and **report**

## The Process

- **Same defect elsewhere:** search for the pattern with `ast-grep`; list those places and ask
  whether to fix them in this change.
- **Corrupted data:** if a data fix or migration is needed, it needs approval - never run it
  silently.
- **Bug List input:** fix Critical first, then High, then Medium/Low; run the related tests after
  each group.
- **Commit message:** `fix(<scope>): <what was wrong>` + ticket; body: root cause, fix, test.

## Key Principles

- Test first, always red before green
- Smallest change that removes the root cause
- No data fixes without approval
- Report what you ran, not what you expect

## Transition

Report: root cause, fix, test added, commands run, follow-ups. Next: `@tester` re-runs the
regression test and related suite, then `@reviewer` checks the diff (`/fix` steps 5-7).
