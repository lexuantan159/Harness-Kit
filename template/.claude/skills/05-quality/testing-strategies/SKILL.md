---
name: testing-strategies
description: Choose what to test at which level (unit, integration, contract, E2E), set up test data and environments, and fix flaky tests. Use when planning tests for a feature, building a test suite, or dealing with slow/flaky tests.
---

# Testing strategies

## Levels (most tests at the bottom)
| Level | What | Tools (examples) |
|---|---|---|
| Unit | Pure logic, fast, no I/O | JUnit, Jest/Vitest, pytest |
| Integration | Real DB/queue via containers, framework slices | Testcontainers, Spring Boot test, supertest |
| Contract | API/event compatibility between services | Pact, OpenAPI validation |
| E2E | A few critical user journeys | Playwright, Cypress |

## Plan per feature
- Unit: every business rule, edge and error case.
- Integration: each endpoint/repository once for wiring, validation, authz and persistence.
- E2E: only if it is a critical journey not covered otherwise.

## Test data
Builders/factories with sensible defaults; each test creates what it needs; no shared mutable
fixtures; no production data.

## Flaky tests
Find the cause (time, order dependence, async waits, shared state, network) and fix it; use
explicit waits on conditions, never `sleep`. Quarantine only with a ticket.

See `.claude/references/testing-patterns.md`.
