---
name: bug-fixing
description: Fix a diagnosed bug with a regression test and the smallest root-cause change, then verify nothing else broke. Use after debugging has found the root cause (/fix).
---

# Bug fixing

1. **Regression test first** - reproduces the bug through the public interface; run it and see it
   fail for the right reason (assertion, not a compile error).
2. **Fix the root cause** with the smallest diff. If the same defect pattern exists elsewhere
   (search with `ast-grep`), list those places and ask whether to fix them in this change.
3. **Run** the regression test (green), the module's tests, then the full verify commands.
4. **Blast radius** - check callers and data already corrupted by the bug (is a data fix or
   migration needed? that needs approval).
5. **Commit** `fix(<scope>): <what was wrong>` + ticket; body: root cause, fix, test.
6. **Report** - root cause, fix, test added, commands run, follow-ups.

Never: suppress the error, widen a catch, add a sleep/retry to hide a race, or edit the test's
expectation to match the buggy behaviour.
