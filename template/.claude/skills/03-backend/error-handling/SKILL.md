---
name: error-handling
description: Consistent error handling - exception hierarchy, central mapping to responses, retries, logging, user-facing messages. Use when adding error paths, integrating external services, or reviewing try/catch code.
---

# Error handling

1. **Follow the project pattern** - find the global handler (`@ControllerAdvice`, middleware,
   exception filter) and the existing exception types. Extend them; don't invent a parallel one.
2. **Classify**
   - Client errors (validation, not found, conflict, forbidden) -> 4xx with a clear message.
   - Transient (timeout, 503, deadlock) -> retry with backoff + jitter, bounded, idempotent ops only.
   - Bugs / invariants broken -> 500, alert, fix the code.
3. **Catch only what you can handle.** No `catch (Exception e) {}`; no catch-log-rethrow at every
   layer. Wrap with context when crossing a boundary (`new PaymentFailed(orderId, e)`).
4. **Log once**, at the boundary that handles it: message, ids, cause - no secrets/personal data.
5. **User messages** are safe and actionable; internals (stack, SQL, hostnames) never leave the server.
6. **External calls** always have timeouts; consider circuit breakers for flaky dependencies.
7. **Resources** - use try-with-resources / `with` / `finally` / `using`.
8. **Test** the error paths, not only the happy path.
