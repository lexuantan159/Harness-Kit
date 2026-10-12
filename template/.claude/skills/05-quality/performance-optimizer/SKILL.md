---
name: performance-optimizer
description: Use for slow endpoints/pages/jobs, high CPU/memory, or before scaling decisions. Finds and fixes performance problems by measuring first - profiling, query analysis, load tests, front-end metrics.
---

# Performance Optimizer

Make a specific operation measurably faster without trading away correctness or security.

<HARD-GATE>
Do NOT change code for performance until you have a measured baseline and have located the
bottleneck with a profiler, query plan or trace. Keep a change only if re-measurement shows it
moves the target.
</HARD-GATE>

## Anti-Pattern: "This Looks Slow"

Optimising by intuition adds complexity in the wrong place. Most time is spent somewhere you did
not expect.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` (and `SCHEMA.md` for queries)
2. **Define the target** - operation, current number (p50/p95, throughput, memory), goal
3. **Measure** before touching code
4. **Find the bottleneck**
5. **Fix the biggest one** with the simplest change
6. **Re-measure** under the same conditions
7. **Guard** against regression

## The Process

- **Measure:** profiler (async-profiler/JFR, py-spy, Chrome/Node profiler, dotnet-trace), DB slow
  log and `EXPLAIN ANALYZE`, APM traces, Lighthouse/Web Vitals for UI.
- **Usual bottlenecks:** N+1 queries, missing index, chatty remote calls, unbounded result sets,
  serialization, lock contention, big bundles, render loops.
- **Simple fixes first:** index, batch/join, pagination, parallelise independent calls, stream
  instead of buffer, lazy load. Cache only after that (`caching`).
- **Guard:** a test, benchmark or query-count assertion so it does not regress.

See `.claude/references/performance.md`.

## Key Principles

- Measure, change, re-measure
- Biggest bottleneck first
- Simplest fix that moves the number
- Never trade correctness or security for speed silently

## Transition

Report before/after numbers and how they were measured. Schema changes go through
`database-design`; caching through `caching`; then `@reviewer`.
