---
name: technology-evaluation
description: Compare libraries, frameworks, services or approaches against project constraints and recommend one. Use when choosing or replacing a dependency, tool or platform.
---

# Technology evaluation

1. **Need** - one paragraph: what problem, which constraints (stack, licence, hosting, budget,
   security, team skill). Confirm the need passes the ponytail ladder (can we avoid a new dependency?).
2. **Candidates** - 2-4 options, always including what the codebase already uses.
3. **Criteria** (weight them for this project):
   fit with stack, maturity & maintenance (release cadence, issues, bus factor), licence,
   security track record, performance, learning curve, lock-in & exit cost, operational cost.
4. **Evidence** - docs, changelogs, a tiny spike if the decision is expensive. Note sources.
5. **Recommend** one, state the accepted trade-off and the exit plan.
6. Record as an ADR in `docs/ai/decisions/<NNN>-<slug>.md`: context, options, decision, consequences.

Adding the dependency still needs the user's approval.
