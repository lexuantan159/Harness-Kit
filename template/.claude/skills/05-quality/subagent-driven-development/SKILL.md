---
name: subagent-driven-development
description: Use in the main session or a command for multi-step tasks where specialised agents or parallel independent work help. Orchestrates the agent team (planner, coder, tester, reviewer, researcher...) with clear handoffs and isolated context.
---

# Subagent-Driven Development

Split work across the agent team so each agent gets a focused context and a clear contract.
Patterns, anti-patterns and handoff formats: `.claude/references/orchestration-patterns.md`.

## Anti-Pattern: "Agents Calling Agents"

An agent that invokes another agent loses context at each hop and doubles the cost. The main
session or a slash command is the orchestrator; agents only *recommend* the next agent.

## Checklist

1. **Decide** whether to delegate at all (Decision Flow in the reference)
2. **Pick the pattern** - direct, fan-out, pipeline, research isolation, generator/critic, gate
3. **Write the handoff** for every delegation
4. **Run** - parallel only for independent work on different files
5. **Verify** subagent claims before reporting them

## The Process

**When to delegate**
- Broad search or investigation -> `@researcher` (keeps the main context clean).
- Independent tasks that don't touch the same files -> parallel subagents.
- Independent judgement -> `@reviewer` / `@senior-reviewer` (never self-approve).

**Handoff contract** (every delegation)
- **Goal** and acceptance criteria.
- **Inputs**: exact files, plan step, Issue List / Bug List, constraints (ponytail, no new deps,
  don't touch X).
- **Output format** expected back (diff summary, Issue List, Bug List, verdict).
- **Budget**: max attempts/rounds (3).

**Pipeline**
`@planner` -> (approval) -> `@coder` <-> `@tester` (per step, Bug List) -> `@reviewer` (Issue
List) -> `@senior-reviewer` (risky) -> commit as the command says (push / PR only if asked).

## Key Principles

- Subagents start cold: give them everything they need
- Verify claims (re-run the test, read the diff) before reporting done
- Never two writers on the same files in parallel
- Orchestration depth at most 1

## Transition

When all delegated work is verified, run the full verify commands and write the session summary
(`docs/ai/sessions/<YYYY-MM-DD>-<slug>.md`).
