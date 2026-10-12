---
name: caching
description: Use when a read path is slow or expensive, or when touching existing cache code. Adds or reviews caching (in-memory, Redis, HTTP) with correct keys, TTLs, invalidation and failure behaviour.
---

# Caching

Make an expensive read cheap without serving wrong or someone else's data.

<HARD-GATE>
Do NOT add a cache before measuring the read path (`performance-optimizer`) and fixing N+1
queries and missing indexes where they exist. Never put secrets, tokens or personal data in a
shared cache without encryption and a TTL.
</HARD-GATE>

## Anti-Pattern: "Just Cache It"

A cache hides the real problem, adds invalidation bugs, and a key missing one dimension leaks
data between users.

## Checklist

1. **Prove the need** - a measured baseline
2. **Choose the layer**
3. **Design the key** - every dimension that changes the result
4. **Freshness** - TTL and invalidation
5. **Stampede** protection for hot keys
6. **Failure** behaviour
7. **Observe and test**

## The Process

- **Layer:** HTTP (`Cache-Control`, `ETag`) for public reads; in-process (Caffeine, lru-cache,
  functools.lru_cache) for small per-instance data; distributed (Redis) when instances must agree.
- **Key:** tenant, user/permissions, locale, version, parameters. Missing a dimension = data leak.
- **Freshness:** a TTL always (with jitter). Invalidate on write (delete the key after commit), or
  accept staleness explicitly and document it.
- **Stampede:** single-flight / lock or stale-while-revalidate for hot keys.
- **Failure:** cache down degrades to the source, never fails the request; timeouts on cache calls.
- **Observe:** hit ratio, evictions, latency; tests for invalidation.

See `.claude/references/performance.md`.

## Key Principles

- Measure first, cache last
- Every dimension in the key
- Always a TTL
- Cache failure never fails the request

## Transition

Re-measure with `performance-optimizer` and report before/after numbers; then `@reviewer`.
