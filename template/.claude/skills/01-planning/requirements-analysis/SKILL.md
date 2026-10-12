---
name: requirements-analysis
description: Use before planning any ticket, or when a requirement is ambiguous. Turns a ticket or request into precise, testable requirements and acceptance criteria, surfacing gaps and assumptions.
---

# Requirements Analysis

Turn a request into requirements precise enough to test, with every gap visible.

<HARD-GATE>
Do NOT fill gaps on business rules, data deletion, auth or public API contracts with guesses.
Each such gap is a blocking question until the user or ticket answers it.
</HARD-GATE>

## Anti-Pattern: "I Know What They Mean"

Unstated assumptions become the bugs found in acceptance testing. Write them down so they can be
corrected cheaply now.

## Checklist

1. **Context** - read `docs/ai/context/BUSINESS.md` and `ARCHITECTURE.md`
2. **Restate** the request: actor, goal, benefit
3. **Extract** functional requirements
4. **Acceptance criteria** in Given / When / Then
5. **Non-functional** requirements that apply
6. **Out of scope**
7. **Gaps & assumptions**
8. **Check against code**

## The Process

- **Functional:** numbered statements ("The system shall ...").
- **Acceptance criteria:** the happy path, at least two edge cases, and the error/permission path.
- **Non-functional:** performance, security/permissions, audit, i18n, accessibility,
  compatibility, data retention - only those that apply.
- **Out of scope:** say explicitly what is not included.
- **Gaps:** mark each as a question (blocks work) or an assumption (we proceed, user can correct).
- **Against code:** does current behaviour already contradict or partly satisfy it? (`scout`)
- **Business rules:** apply `business-context` when rules are touched.

## Key Principles

- Testable or it isn't a requirement
- Edge and error paths are requirements too
- Gaps visible, never silently filled
- Out of scope is written down

## Transition

Requirements and acceptance criteria feed `writing-plans` (`/plan`) or `spec.md`
(`spec-driven-development`).
