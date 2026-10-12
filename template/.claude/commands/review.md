---
description: Self-review the current branch with the reviewer agent before asking humans
argument-hint: "[base branch]  (default: the default branch)"
---

Review the current branch. Base branch: $ARGUMENTS (empty = the default branch).

1. Show `git status` and `git diff --stat <base>...HEAD` (include uncommitted changes).
2. `@reviewer` reviews the full diff. For changes touching auth, payments, personal data,
   permissions or public APIs, also run `@senior-reviewer`.
3. Run the verify commands from CLAUDE.md and include the results.
4. Save the report to `docs/ai/reviews/<branch>.md` (branch name with `/` replaced by `-`).
5. Reply with the verdict and the Critical and Important issues. Do not fix anything unless the user asks.
