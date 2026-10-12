# Performance Checklist

Quick reference for finding and fixing performance problems. Used by the `performance-optimizer`
and `caching` skills, `reviewer` and `pr-review`. Code examples are SQL/TypeScript; apply the same
rule in the project's own stack.

## Table of Contents

- [Method](#method)
- [Database](#database)
- [Remote Calls & Concurrency](#remote-calls--concurrency)
- [Async Work & Caching](#async-work--caching)
- [Front End (Core Web Vitals)](#front-end-core-web-vitals)
- [Bundle & Assets](#bundle--assets)
- [Measuring Tools](#measuring-tools)
- [Symptom Quick Reference](#symptom-quick-reference)

## Method

Measure -> fix the biggest bottleneck -> re-measure under the same conditions -> add a guard.
Report p50/p95 before and after.

- [ ] Target defined: operation, current number, goal
- [ ] Baseline measured before any change
- [ ] Change kept only if it moves the target
- [ ] Guard added (test, benchmark or query-count assertion)

## Database

- [ ] No N+1 queries (check query count in tests or logs)
- [ ] Indexes support the WHERE/JOIN/ORDER BY of new queries (`EXPLAIN`)
- [ ] Result sets paginated/bounded; streaming for large exports
- [ ] Only the needed columns selected for hot paths

```sql
-- N+1: one query per order
SELECT * FROM order_items WHERE order_id = ?;      -- executed N times

-- Fix: one query for all orders (or a JOIN / ORM fetch join)
SELECT * FROM order_items WHERE order_id IN (?, ?, ?);

-- Check the plan of a new query
EXPLAIN ANALYZE SELECT id, status FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 20;
-- Look for Seq Scan on large tables -> composite index (customer_id, created_at)
```

## Remote Calls & Concurrency

- [ ] Independent remote calls in parallel; all remote calls have timeouts
- [ ] Connection pools sized; no blocking calls on event loops / reactive threads
- [ ] Retries bounded, with backoff + jitter, idempotent operations only

```typescript
// Sequential: latency = a + b. Parallel with timeouts: latency = max(a, b)
const [user, orders] = await Promise.all([
  fetch(`${USERS}/${id}`, { signal: AbortSignal.timeout(2000) }),
  fetch(`${ORDERS}?user=${id}`, { signal: AbortSignal.timeout(2000) }),
]);
```

## Async Work & Caching

- [ ] Heavy work moved to async jobs where the user doesn't need to wait
- [ ] Caching only after measuring, with correct keys and invalidation (`caching` skill)
- [ ] Cache failure degrades to the source, never fails the request

## Front End (Core Web Vitals)

- [ ] LCP < 2.5s: optimise hero image, preload critical resources, SSR/SSG where useful
- [ ] INP < 200ms: avoid long tasks, debounce expensive handlers, virtualise long lists
- [ ] CLS < 0.1: reserve space for images/ads/fonts

```html
<!-- LCP: preload and prioritise the hero image; CLS: reserve its space -->
<link rel="preload" as="image" href="/hero.avif">
<img src="/hero.avif" width="1200" height="600" fetchpriority="high" alt="...">
```

## Bundle & Assets

- [ ] Code-split routes; lazy-load heavy components
- [ ] Tree-shake; no duplicate libraries
- [ ] Images compressed (AVIF/WebP) and sized for their slot

```typescript
// Load a heavy route only when it is visited
const Reports = lazy(() => import('./pages/Reports'));
```

## Measuring Tools

| Layer | Tools |
|---|---|
| JVM | async-profiler, JFR, Micrometer metrics |
| Node | `--cpu-prof`, clinic.js, Chrome DevTools |
| Python | py-spy, cProfile |
| .NET | dotnet-trace, dotnet-counters |
| Database | slow query log, `EXPLAIN ANALYZE`, `pg_stat_statements` |
| Distributed | APM / OpenTelemetry traces |
| Front end | Lighthouse, Web Vitals, DevTools Performance panel |
| Load | k6, Gatling, JMeter |

## Symptom Quick Reference

| Symptom | Likely cause | First fix |
|---|---|---|
| Latency grows with data size | Missing index, unbounded query | Index, pagination |
| Query count grows with result size | N+1 | Batch query / fetch join |
| Latency = sum of downstream calls | Sequential remote calls | Parallelise independent calls |
| Requests hang under load | Pool exhaustion, no timeouts | Timeouts, pool sizing |
| Event loop lag (Node) | Blocking or CPU-heavy work on the loop | Move to worker / async job |
| Memory grows until restart | Buffering large results, unbounded cache | Stream, bounded cache with TTL |
| Slow first paint | Large bundle, render-blocking resources | Code-split, preload critical |
| Janky interactions | Long tasks, re-rendering large lists | Debounce, virtualise |
