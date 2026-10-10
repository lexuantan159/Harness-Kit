---
name: spec-driven-development
description: Build a feature through Specify -> Plan -> Tasks -> Implement -> Converge with written artefacts and approval gates. Use for /spec and for features too big for a single plan.
---

# Spec-driven development

Artefacts live in `docs/ai/specs/<slug>/`.

## 1. Specify -> `spec.md`  (gate: user approves)
Problem, users, goals/non-goals, requirements, acceptance criteria (Given/When/Then),
non-functional requirements, open questions. No implementation detail.

## 2. Plan -> `plan.md`  (gate: senior-reviewer Approve + user approves)
Design decisions with alternatives considered, touched modules, data model and API changes,
migration and rollback, risks, test strategy.

## 3. Tasks -> `tasks.md`  (gate: user approves)
Ordered checklist. Each task: goal, files, verify command, estimate, depends-on.
Each task must leave the build green.

## 4. Implement
Per task: test first -> implement -> verify -> tick `[x]` in tasks.md. Never batch-tick.

## 5. Converge
Full verify, reviewer on the whole diff, fix loop (max 3), walk every acceptance criterion and
mark it met with evidence. Update ARCHITECTURE/SCHEMA if the design changed. Session summary.

If the spec changes mid-way, update `spec.md` first, then re-derive plan and tasks.
