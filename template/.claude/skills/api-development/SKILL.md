---
name: api-development
description: Implement an API endpoint end to end - controller, validation, service, persistence, mapping, tests - following the project's layering. Use when building or changing an endpoint after its design is agreed.
---

# API development

1. Find the closest existing endpoint and mirror its layers and file layout.
2. **Contract first** - request/response DTOs and OpenAPI entry; never expose entities directly.
3. **Validation at the boundary** - bean validation / schema (zod, pydantic, ...) on input;
   reject unknown/oversized input; return the project's error format.
4. **Authorization** - check permission and ownership (object-level) in the service, not only
   at the route.
5. **Service** - business logic, transactions at this layer; no HTTP types inside.
6. **Persistence** - parameterised queries/ORM, avoid N+1, index for new query patterns.
7. **Mapping & errors** - map domain exceptions to status codes centrally (`error-handling`).
8. **Tests**
   - unit tests for service logic (happy, edge, error);
   - one integration/slice test per endpoint: status, body, validation error, authz failure.
9. **Observability** - log at boundaries with correlation id, no personal data/secrets.
10. Run build + tests; update OpenAPI and docs.
