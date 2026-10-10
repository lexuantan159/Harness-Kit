---
name: api-design
description: Design HTTP/REST APIs - resources, URLs, methods, status codes, errors, pagination, versioning - consistent with existing endpoints. Use before adding or changing an endpoint or public contract.
---

# API design

1. **Copy house style first** - find 2-3 existing endpoints and match URL shape, naming case,
   envelope, error format, auth and pagination. Consistency beats textbook purity.
2. **Resources** - plural nouns (`/orders/{id}/items`), no verbs except for true actions
   (`POST /orders/{id}:cancel` or `/orders/{id}/cancel` - whichever the project uses).
3. **Methods** - GET (safe), POST (create/action), PUT (replace), PATCH (partial), DELETE.
   Make PUT/DELETE idempotent; support `Idempotency-Key` for retried POSTs on payments etc.
4. **Status codes** - 200/201(+Location)/204; 400 validation, 401 unauthenticated,
   403 forbidden, 404, 409 conflict, 422 if the project uses it, 429, 5xx never for client errors.
5. **Errors** - one format everywhere, e.g. RFC 9457 problem+json: `type, title, status, detail,
   instance, errors[]`. Never leak stack traces or SQL.
6. **Collections** - pagination (cursor for large/changing sets), filtering, sorting, max page size.
7. **Compatibility** - additive changes only on a published version; breaking change -> new
   version or deprecation period. Public contract changes need user approval.
8. **Document** in OpenAPI (`openapi` skill) in the same change.
