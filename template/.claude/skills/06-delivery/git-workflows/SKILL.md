---
name: git-workflows
description: Use for committing, preparing a PR, resolving conflicts, or cleaning up history. Handles branching, commits, rebasing, PRs and conflict resolution following the project's conventions, safely.
---

# Git Workflows

Keep history readable and shared branches safe.

<HARD-GATE>
Do NOT push, open PRs, force-push, `reset --hard`, `clean -f` or rewrite pushed history unless the
user asked for it. Never `push --force` to a shared branch (use `--force-with-lease` on your own
branch only, if allowed).
</HARD-GATE>

## Anti-Pattern: "WIP, Fix, Fix Again"

Commits that mix concerns or say nothing make review, bisect and revert painful. One logical
change per commit, with a message that explains why.

## Checklist

1. **Context** - match the project's branch names (`git branch -r`) and commit style (`git log`)
2. **Branch** from the default branch
3. **Commit** - one logical change, checked for secrets
4. **Before a PR** - update, verify, self-review
5. **Conflicts** - keep both intents
6. **Push / PR** only when asked

## The Process

- **Branches:** `feature/<ticket>-<slug>`, `fix/<ticket>-<slug>`, `chore/...`.
- **Commits (Conventional Commits):** `type(scope): summary` - feat, fix, refactor, test, docs,
  chore, perf, build, ci. Imperative, <= 72 chars, ticket reference in the summary or footer. Body
  explains *why*. Check `git diff --cached` first: no secrets, build output or debug code.
- **Before a PR:** rebase on or merge the latest default branch (project convention), run the
  verify commands, self-review (`/review`). PR description: what, why, how tested, risks,
  screenshots for UI (`technical-writing`).
- **Conflicts:** understand both sides (`git log -p --merge`), keep both intents, re-run tests.

## Key Principles

- One logical change per commit
- The message says why
- Shared history is never rewritten
- Push only when asked

## Transition

After the user approves pushing: `gh pr create` with the PR template; review comes from humans or
`/pr-review`.
