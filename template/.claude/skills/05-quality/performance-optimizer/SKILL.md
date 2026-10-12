---
name: performance-optimizer
description: Find and fix performance problems by measuring first - profiling, query analysis, load tests, front-end metrics. Use for slow endpoints/pages/jobs, high CPU/memory, or before scaling decisions.
---

# Performance optimizer

1. **Define the target** - which operation, current number (p50/p95, throughput, memory), goal.
2. **Measure** before touching code: profiler (async-profiler/JFR, py-spy, Chrome/Node profiler,
   dotnet-trace), DB slow log and `EXPLAIN ANALYZE`, APM traces, Lighthouse/Web Vitals for UI.
3. **Find the bottleneck** - usually: N+1 queries, missing index, chatty remote calls, unbounded
   result sets, serialization, lock contention, big bundles, render loops.
4. **Fix the biggest one** with the simplest change (index, batch/join, pagination, parallelise
   independent calls, stream instead of buffer, lazy load). Cache only after (`caching`).
5. **Re-measure** under the same conditions; keep the change only if it moves the target.
6. **Guard** - add a test/benchmark or query-count assertion so it doesn't regress.

See `.claude/references/performance.md`. Never trade correctness or security for speed silently.
