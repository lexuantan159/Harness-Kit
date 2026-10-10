---
name: git-workflows
description: Branching, commits, rebasing, PRs and conflict resolution following the project's conventions, safely. Use for committing, preparing a PR, resolving conflicts, or cleaning up history.
---

# Git workflows

## Branches
`feature/<ticket>-<slug>`, `fix/<ticket>-<slug>`, `chore/...` from the default branch
(match the project's existing names: `git branch -r`).

## Commits (Conventional Commits)
`type(scope): summary` - types: feat, fix, refactor, test, docs, chore, perf, build, ci.
Imperative, <= 72 chars, ticket reference in the summary or footer. Body explains *why*.
One logical change per commit; never commit secrets, build output or debug code
(check `git diff --cached` first).

## Before a PR
Rebase on or merge the latest default branch (project convention), run the verify commands,
self-review (`/review`). PR description: what, why, how tested, risks, screenshots for UI.

## Conflicts
Understand both sides (`git log -p --merge`), keep both intents, re-run tests.

## Safety
- No `push --force` to shared branches (use `--force-with-lease` on your own branch only, if allowed).
- No `reset --hard`, `clean -f`, history rewrites on pushed commits without the user's go-ahead.
- Push and open PRs only when the user asks.
