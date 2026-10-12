---
name: openapi
description: Use when adding or changing endpoints, generating clients, or reviewing API docs. Writes and maintains OpenAPI 3 specs - paths, schemas, errors, security, examples - and keeps them in sync with code.
---

# OpenAPI

Keep the API contract accurate, complete and in step with the code.

## Anti-Pattern: "Docs Later"

A spec updated after the code drifts from it on day one, and generated clients break. Update the
spec in the same change.

## Checklist

1. **Context** - find how the project does it: code-first (springdoc, NestJS swagger, FastAPI) or
   spec-first (`openapi.yaml` + generator). Follow that; don't mix
2. **Operations** - complete per operation
3. **Schemas** - reused and constrained like the server validation
4. **Errors** - one shared error schema
5. **Examples**
6. **Validate**
7. **Flag breaking changes**

## The Process

- **Operations:** `operationId` (unique, verb+noun), summary, tags, parameters with types and
  constraints, request body schema, every response code the endpoint can return, security.
- **Schemas:** reuse `components/schemas`; `required` lists; formats (`date-time`, `uuid`,
  `email`); enums; `maxLength`/`maximum` matching server validation; `nullable` (3.0) or
  `type: [x, "null"]` (3.1) used correctly.
- **Errors:** one shared error schema (e.g. problem+json) referenced by all 4xx/5xx responses.
- **Examples:** realistic request and main responses, no real personal data.
- **Validate:** `npx @redocly/cli lint openapi.yaml` (or the project's linter) when available.
- **Breaking changes** (removed field, new required field, type change): flag them; they need
  versioning or approval (`api-design`).

## Key Principles

- One approach per project: code-first or spec-first
- Spec changes ship with code changes
- Constraints match server validation
- Breaking changes are flagged, never silent

## Transition

Implement or update the endpoint with `api-development`; `@reviewer` checks spec and code together.
