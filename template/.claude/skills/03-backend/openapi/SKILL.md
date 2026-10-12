---
name: openapi
description: Write and maintain OpenAPI 3 specs - paths, schemas, errors, security, examples - and keep them in sync with code. Use when adding/changing endpoints, generating clients, or reviewing API docs.
---

# OpenAPI

1. Find how the project does it: code-first (springdoc, NestJS swagger, FastAPI) or spec-first
   (`openapi.yaml` + generator). Follow that; don't mix.
2. Per operation: `operationId` (unique, verb+noun), summary, tags, parameters with types and
   constraints, request body schema, every response code the endpoint can return, security.
3. Schemas: reuse `components/schemas`; `required` lists; formats (`date-time`, `uuid`, `email`);
   enums; `maxLength`/`maximum` matching server validation; `nullable`/`type: [x, "null"]` correctly.
4. Errors: one shared error schema (e.g. problem+json) referenced by all 4xx/5xx responses.
5. Examples for request and main responses - realistic, no real personal data.
6. Validate: `npx @redocly/cli lint openapi.yaml` (or the project's linter) when available.
7. Breaking changes (removed field, new required field, type change) -> flag them; they need
   versioning or approval (`api-design`).
