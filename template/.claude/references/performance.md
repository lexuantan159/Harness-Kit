# Performance checklist

## Back end
- [ ] No N+1 queries (check query count in tests or logs)
- [ ] Indexes support the WHERE/JOIN/ORDER BY of new queries (`EXPLAIN`)
- [ ] Result sets paginated/bounded; streaming for large exports
- [ ] Independent remote calls in parallel; all remote calls have timeouts
- [ ] Connection pools sized; no blocking calls on event loops / reactive threads
- [ ] Heavy work moved to async jobs where the user doesn't need to wait
- [ ] Caching only after measuring, with correct keys and invalidation

## Front end (Core Web Vitals)
- [ ] LCP < 2.5s: optimise hero image, preload critical resources, SSR/SSG where useful
- [ ] INP < 200ms: avoid long tasks, debounce expensive handlers, virtualise long lists
- [ ] CLS < 0.1: reserve space for images/ads/fonts
- [ ] Bundle: code-split routes, tree-shake, no duplicate libraries, compress images (AVIF/WebP)

## Method
Measure -> fix the biggest bottleneck -> re-measure under the same conditions -> add a guard.
Report p50/p95 before and after.
