---
description: Assess an idea or feature request - value, cost, risk - and return Go / Clarify / Kill
argument-hint: "<idea or feature request>"
---

Assess: $ARGUMENTS

Use the `idea-assessment` skill (with `business-context` and, if a new technology is involved,
`technology-evaluation`).

1. Restate the idea and the problem it solves; who benefits and how we would measure it.
2. Check fit with `docs/ai/context/BUSINESS.md` and `ARCHITECTURE.md`.
3. Estimate effort (T-shirt size) using `@researcher` for blast radius if code is affected.
4. List risks (technical, security, data, operational) and cheaper alternatives, including
   "do nothing".
5. Verdict:
   - **Go** - clear value, acceptable cost and risk; propose the next step (`/spec` or `/plan`).
   - **Clarify** - list the exact questions that decide it.
   - **Kill** - explain why and what would change the verdict.
Save to `docs/ai/assessments/<slug>.md`.
