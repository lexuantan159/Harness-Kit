---
name: caching
description: Add or review caching (in-memory, Redis, HTTP) with correct keys, TTLs, invalidation and failure behaviour. Use when a read path is slow or expensive, or when touching existing cache code.
---

# Caching

1. **Prove the need** - measure first (`performance-optimizer`). Caching hides problems; fix
   N+1 queries and missing indexes before caching.
2. **Choose the layer** - HTTP (`Cache-Control`, `ETag`) for public reads; in-process (Caffeine,
   lru-cache, functools.lru_cache) for small, per-instance data; distributed (Redis) when
   instances must agree.
3. **Key** - include everything that changes the result: tenant, user/permissions, locale,
   version, parameters. Missing a dimension = data leak between users.
4. **Freshness** - TTL always (with jitter). Invalidate on write (delete key after commit),
   or accept staleness explicitly and document it.
5. **Stampede** - single-flight / lock or stale-while-revalidate for hot keys.
6. **Failure** - cache down must degrade to the source, not fail the request. Timeouts on cache calls.
7. **Never cache** secrets, tokens, or personal data in shared caches without encryption & TTL.
8. **Observe** - hit ratio, evictions, latency; tests for invalidation.
