---
name: technology-evaluation
description: Use when choosing or replacing a dependency, tool or platform. Compares libraries, frameworks, services or approaches against project constraints and recommends one, recorded as an ADR.
---

# Technology Evaluation

Choose a technology on evidence against this project's constraints, and record why.

<HARD-GATE>
Do NOT add, install or switch to a dependency during the evaluation. Adding it needs the user's
approval of the recommendation.
</HARD-GATE>

## Anti-Pattern: "It's Popular"

Popularity says nothing about fit with this stack, licence or team. Without criteria the loudest
option wins.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` and the build files for what is already used
2. **Need** - the problem and constraints; does it pass the ponytail ladder?
3. **Criteria** - weighted for this project
4. **Candidates** - 2-4 options, always including what the codebase already uses
5. **Evidence** - sources, a spike if expensive
6. **Recommend** one with the accepted trade-off and exit plan
7. **Record** an ADR

## The Process

- **Need:** one paragraph: what problem, which constraints (stack, licence, hosting, budget,
  security, team skill). Can we avoid a new dependency (YAGNI -> reuse -> stdlib -> existing)?
- **Criteria:** fit with stack, maturity & maintenance (release cadence, issues, bus factor),
  licence, security track record, performance, learning curve, lock-in & exit cost, operational cost.
- **Evidence:** docs, changelogs, a tiny spike if the decision is expensive. Note sources.
- **ADR:** `docs/ai/decisions/<NNN>-<slug>.md`: context, options, decision, consequences
  (`technical-writing`).

## Key Principles

- No new dependency is the best dependency
- Criteria before candidates
- Evidence with sources
- Always an exit plan

## Transition

The user approves the recommendation; then `/plan` includes adding the dependency as a step.
