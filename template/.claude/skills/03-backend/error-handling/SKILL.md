---
name: error-handling
description: Use when adding error paths, integrating external services, or reviewing try/catch code. Applies consistent error handling - exception hierarchy, central mapping to responses, retries, logging, user-facing messages.
---

# Error Handling

Make failures predictable for callers, diagnosable for operators and safe for users.

## Anti-Pattern: "Catch Everything"

`catch (Exception e) {}` and catch-log-rethrow at every layer hide bugs and flood the logs.
Catch only what you can handle.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` (cross-cutting: error handling); find the
   global handler and existing exception types
2. **Classify** each failure
3. **Handle** at the right layer
4. **Log once**
5. **Safe user messages**
6. **Timeouts and resources**
7. **Test the error paths**

## The Process

- **Follow the project pattern:** `@ControllerAdvice`, middleware, exception filter. Extend it;
  don't invent a parallel one.
- **Classify:**
  - client errors (validation, not found, conflict, forbidden) -> 4xx with a clear message
  - transient (timeout, 503, deadlock) -> retry with backoff + jitter, bounded, idempotent ops only
  - bugs / broken invariants -> 500, alert, fix the code
- **Wrap with context** when crossing a boundary (`new PaymentFailed(orderId, e)`).
- **Log once**, at the boundary that handles it: message, ids, cause - no secrets/personal data.
- **User messages** are safe and actionable; internals (stack, SQL, hostnames) never leave the
  server (`.claude/references/security.md`, Error Handling).
- **External calls** always have timeouts; consider circuit breakers for flaky dependencies.
- **Resources:** try-with-resources / `with` / `finally` / `using`.

## Key Principles

- Catch only what you can handle
- Log once, where handled
- Retry only transient errors on idempotent operations
- Internals never reach the user

## Transition

Error-path tests are part of the same step (`test-driven-development`); logging conventions come
from `observability`.
