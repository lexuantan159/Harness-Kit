---
description: Turn a ticket or description into an approved implementation plan with estimates (no code changes)
argument-hint: "<ticket key | description>"
---

Plan: $ARGUMENTS

1. Get the requirement. If only a ticket key is given and its text is not in the conversation,
   ask the user to paste it (credentials for trackers live in `mcp/.env`; never print them).
2. Read `docs/ai/context/ARCHITECTURE.md` and `BUSINESS.md`.
3. Use `@planner` with the `requirements-analysis` and `writing-plans` skills to produce the plan:
   goal, acceptance criteria, relevant code, steps (files + verify + estimate), risks, questions.
4. For risky scope (auth, payments, data migration, public API) ask `@senior-reviewer` for one
   review round of the plan and incorporate its required changes.
5. Save to `docs/ai/plans/<ticket-or-slug>.md`.
6. Stop. Show the plan summary and ask for approval. Do not edit code.
