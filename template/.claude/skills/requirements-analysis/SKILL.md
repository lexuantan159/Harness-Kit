---
name: requirements-analysis
description: Turn a ticket or request into precise, testable requirements and acceptance criteria, surfacing gaps and assumptions. Use before planning any ticket, or when a requirement is ambiguous.
---

# Requirements analysis

1. **Restate** the request in your own words: actor, goal, benefit.
2. **Extract** functional requirements as numbered statements ("The system shall ...").
3. **Acceptance criteria** in Given / When / Then, including:
   - the happy path, at least two edge cases, and the error/permission path.
4. **Non-functional**: performance, security/permissions, audit, i18n, accessibility,
   compatibility, data retention - only those that apply.
5. **Out of scope**: say explicitly what is not included.
6. **Gaps & assumptions**: list every ambiguity. Mark each as a question (blocks work) or an
   assumption (we proceed, user can correct).
7. **Check against code**: does current behaviour already contradict or partly satisfy it?

Never fill gaps on business rules, data deletion, auth or public API contracts with guesses.
