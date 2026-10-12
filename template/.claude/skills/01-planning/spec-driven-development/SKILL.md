---
name: spec-driven-development
description: Use for /spec and for features too big for a single plan. Builds a feature through Specify -> Plan -> Tasks -> Implement -> Converge with written artefacts and approval gates.
---

# Spec-Driven Development

Build a large feature from written, approved artefacts so every line of code traces back to an
agreed requirement. Artefacts live in `docs/ai/specs/<slug>/`.

<HARD-GATE>
Do NOT start a phase until the previous phase's gate has passed: user approval after Specify,
`@senior-reviewer` Approve (or the human's explicit decision after escalation) plus user
approval after Plan, user approval after Tasks. No code before Tasks is approved.
</HARD-GATE>

## Anti-Pattern: "The Spec Is In My Head"

Implementing from a verbal agreement means each phase re-decides the last one. Write it down,
get it approved, then build on it.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md`, `SCHEMA.md`, `BUSINESS.md`
2. **Specify** -> `spec.md` (gate: user approves)
3. **Plan** -> `plan.md` (gate: senior-reviewer Approve + user approves)
4. **Tasks** -> `tasks.md` (gate: user approves)
5. **Implement** task by task
6. **Converge**

## The Process

- **Specify:** problem, users, goals/non-goals, requirements, acceptance criteria
  (Given/When/Then), non-functional requirements, open questions. No implementation detail.
  Use `requirements-analysis`; start from a `brainstorming` design doc if there is one.
- **Plan:** design decisions with alternatives considered, touched modules, data model and API
  changes, migration and rollback, risks, test strategy (`@planner`, `senior-review`).
- **Tasks:** ordered checklist. Each task: goal, files, verify command, estimate, depends-on.
  Each task must leave the build green.
- **Implement:** per task: test first -> implement -> verify -> tick `[x]` in tasks.md. Never
  batch-tick (`incremental-implementation`).
- **Converge:** full verify, `@reviewer` on the whole diff, fix loop (max 3), walk every
  acceptance criterion and mark it met with evidence. Update ARCHITECTURE/SCHEMA if the design
  changed. Session summary.
- **Spec changes mid-way:** update `spec.md` first, then re-derive plan and tasks.
- **Not converging after 3 rounds:** append to `docs/ai/report/harness-issues.md` and ask the human.

## Key Principles

- Written and approved before built
- Every task traces to a requirement
- One task at a time, build always green
- Change the spec first, then the code

## Transition

Converge ends with the session summary in `docs/ai/sessions/<date>-<slug>.md`; commit or PR only
if the user asks.
