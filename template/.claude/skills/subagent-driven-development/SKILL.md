---
name: subagent-driven-development
description: Orchestrate work across the agent team (planner, coder, tester, reviewer, researcher...) with clear handoffs and isolated context. Use for multi-step tasks where specialised agents or parallel independent work help.
---

# Subagent-driven development

See `.claude/references/orchestration-patterns.md` for patterns.

## When to delegate
- Broad search or investigation -> `researcher` (keeps the main context clean).
- Independent tasks that don't touch the same files -> parallel subagents.
- Independent judgement -> `reviewer` / `senior-reviewer` (never self-approve).

## Handoff contract (every delegation)
- **Goal** and acceptance criteria.
- **Inputs**: exact files, plan step, constraints (ponytail, no new deps, don't touch X).
- **Output format** expected back (diff summary, findings list, verdict).
- **Budget**: max attempts/rounds (3).

## Pipeline
planner -> (approval) -> coder <-> tester (per step) -> reviewer -> senior-reviewer (risky) -> commit.

## Rules
- Subagents start cold: give them everything they need; don't assume shared memory.
- Verify subagent claims (re-run the test, read the diff) before reporting them as done.
- Don't run two writers on the same files in parallel.
