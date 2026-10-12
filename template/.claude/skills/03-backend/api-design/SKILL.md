---
name: api-design
description: Use before adding or changing an endpoint or public contract. Designs HTTP/REST APIs - resources, URLs, methods, status codes, errors, pagination, versioning - consistent with existing endpoints.
---

# API Design

Design an endpoint that looks like the rest of the API and does not break its clients.

<HARD-GATE>
Do NOT change a public contract (new endpoint, field, status or behaviour) without the user's
approval. A breaking change (removed field, new required field, type or status change) also needs
a versioning or deprecation plan.
</HARD-GATE>

## Anti-Pattern: "Textbook REST"

An endpoint that is "correct" but differs from the house style forces every client to special-case
it. Consistency beats purity.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md`; find 2-3 existing endpoints
2. **Copy house style** - URL shape, naming case, envelope, error format, auth, pagination
3. **Resources and methods**
4. **Status codes and errors**
5. **Collections** - pagination, filtering, sorting
6. **Compatibility check**
7. **Document** in OpenAPI in the same change

## The Process

- **Resources:** plural nouns (`/orders/{id}/items`), no verbs except for true actions
  (`POST /orders/{id}:cancel` or `/orders/{id}/cancel` - whichever the project uses).
- **Methods:** GET (safe), POST (create/action), PUT (replace), PATCH (partial), DELETE. Make
  PUT/DELETE idempotent; support `Idempotency-Key` for retried POSTs on payments etc.
- **Status codes:** 200/201(+Location)/204; 400 validation, 401 unauthenticated, 403 forbidden,
  404, 409 conflict, 422 if the project uses it, 429; 5xx never for client errors.
- **Errors:** one format everywhere, e.g. RFC 9457 problem+json: `type, title, status, detail,
  instance, errors[]`. Never leak stack traces or SQL.
- **Collections:** cursor pagination for large/changing sets; max page size.
- **Compatibility:** additive changes only on a published version; breaking change -> new version
  or deprecation period. Public contract changes need user approval.

## Key Principles

- House style first
- One error format
- Additive by default
- Contract documented with the change

## Transition

Write the contract with `openapi`, then implement with `api-development`. Public contract
changes go through `senior-review`.
