---
name: testing-strategies
description: Use when planning tests for a feature, building a test suite, judging coverage in a review, or dealing with slow/flaky tests. Chooses what to test at which level (unit, integration, contract, E2E) and sets up test data and environments.
---

# Testing Strategies

Put each test at the cheapest level that can catch the failure it guards against.
Patterns: `.claude/references/testing-patterns.md`.

## Anti-Pattern: "E2E Everything"

Testing every rule through the UI is slow, flaky and hard to diagnose. Most tests belong at the
bottom of the pyramid.

## Checklist

1. **Context** - read the test section of `docs/ai/context/ARCHITECTURE.md` and the existing tests
2. **List** the behaviours and risks of the feature
3. **Assign a level** to each (table below)
4. **Plan test data**
5. **Check for flakiness** sources before adding tests

## The Process

**Levels** (most tests at the bottom)

| Level | What | Tools (examples) |
|---|---|---|
| Unit | Pure logic, fast, no I/O | JUnit, Jest/Vitest, pytest |
| Integration | Real DB/queue via containers, framework slices | Testcontainers, Spring Boot test, supertest |
| Contract | API/event compatibility between services | Pact, OpenAPI validation |
| E2E | A few critical user journeys | Playwright, Cypress |

**Plan per feature**
- Unit: every business rule, edge and error case.
- Integration: each endpoint/repository once for wiring, validation, authz and persistence.
- E2E: only if it is a critical journey not covered otherwise.

**Test data** - builders/factories with sensible defaults; each test creates what it needs; no
shared mutable fixtures; no production data.

**Flaky tests** - find the cause (time, order dependence, async waits, shared state, network) and
fix it; use explicit waits on conditions, never `sleep`. Quarantine only with a ticket.

## Key Principles

- Cheapest level that catches the failure
- Each test owns its data
- Deterministic or it doesn't count
- Flaky is a bug, not weather

## Transition

Write the tests with `test-driven-development`; the plan's steps include them (`writing-plans`).
