---
name: senior-review
description: Run an independent senior review gate (Approve / Revise / Reject) on a plan or change, at most 3 rounds, escalating to a human if it does not converge. Use for risky changes and as the gate in /spec and /code.
---

# Senior review gate

1. Give `@senior-reviewer` the artefact (plan path or diff range) and the acceptance criteria -
   **not** your own summary or opinion, so the review stays independent.
2. Round N (N <= 3):
   - **Approve** -> continue.
   - **Revise** -> apply every required change (or explain why one is wrong), then re-submit.
   - **Reject** -> stop, present the reviewer's reasoning and alternative to the user.
3. After round 3 without Approve, append to `docs/ai/report/harness-issues.md`:
   ```
   ## <YYYY-MM-DD> <slug>
   Phase: plan | implement   Rounds: 3   Last verdict: Revise | Reject
   Unresolved: ...
   ```
   Then ask the human to decide.

Mandatory for: auth/permissions, payments/money, personal data, data migrations/deletion,
public API changes, infrastructure/security config.
