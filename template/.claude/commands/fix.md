---
description: Fix a bug - investigate, reproduce with a failing regression test, fix the root cause, verify, PR
argument-hint: "<bug description | ticket | failing test>"
---

Fix: $ARGUMENTS

1. `@researcher` investigates with the `debugging` skill: reproduce, trace, root cause with
   evidence, blast radius. Save to `docs/research/<ticket-or-slug>.md`.
2. If the root cause is unclear or the fix touches business rules / data, stop and ask.
3. Write a regression test that fails for the reported reason. Run it and show it red.
4. `@coder` fixes the root cause (not the symptom) with the smallest diff (`bug-fixing` skill).
5. `@tester` runs the regression test (now green) and the related suite. Max 3 fix attempts.
6. Run the full verify commands from CLAUDE.md.
7. `@reviewer` checks the diff; address MUST-FIX items.
8. Commit `fix(<scope>): <summary>` with the ticket reference; open a PR only if asked.
   Reply with: root cause, fix, test added, commands run.
