---
name: api-development
description: Use when building or changing an endpoint after its contract is agreed. Implements an API endpoint end to end - controller, validation, service, persistence, mapping, tests - following the project's layering.
---

# API Development

Implement an endpoint that follows the project's layers, validates its input and proves its
behaviour with tests.

<HARD-GATE>
Do NOT implement an endpoint whose contract is not agreed. New or changed contracts go through
`api-design` first.
</HARD-GATE>

## Anti-Pattern: "Logic In The Controller"

Business rules in the route handler cannot be reused, tested in isolation or secured
consistently. Keep HTTP at the edge.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md`; find the closest existing endpoint and
   mirror its layers and file layout
2. **Contract first** - request/response DTOs and OpenAPI entry
3. **Validation at the boundary**
4. **Authorization** in the service
5. **Service** logic and transactions
6. **Persistence**
7. **Mapping & errors**
8. **Tests**
9. **Observability**
10. **Verify** - build + tests; OpenAPI and docs updated

## The Process

- **Validation:** bean validation / schema (zod, pydantic, ...) on input; reject unknown or
  oversized input; return the project's error format.
- **Authorization:** check permission and ownership (object-level) in the service, not only at
  the route.
- **Service:** business logic and transactions at this layer; no HTTP types inside.
- **Persistence:** parameterised queries/ORM, avoid N+1, index new query patterns
  (`database-design`).
- **Errors:** map domain exceptions to status codes centrally (`error-handling`).
- **Tests:** unit tests for service logic (happy, edge, error); one integration/slice test per
  endpoint covering status, body, validation error and authz failure (`test-driven-development`).
- **Observability:** log at boundaries with a correlation id, no personal data or secrets.

## Key Principles

- Mirror the closest existing endpoint
- Validate at the edge, authorize in the service
- DTOs, never persistence entities, in requests and responses
- Every endpoint has an authz-failure test

## Transition

`@tester` runs the verify command; then `@reviewer`. Auth-related endpoints also go through
`authentication` and `security-audit`.
