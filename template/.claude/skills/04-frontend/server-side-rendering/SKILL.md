---
name: server-side-rendering
description: Use for SSR pages, hydration errors or SEO issues. Implements or debugs server-side rendering / static generation (Next.js, Nuxt, SvelteKit, Thymeleaf, Razor) - data loading, hydration, caching, SEO.
---

# Server-Side Rendering

Render each route in the cheapest mode that meets its freshness and personalisation needs,
without leaking server-only data.

## Anti-Pattern: "SSR Everything"

Per-request rendering for pages that rarely change wastes servers and slows TTFB. Pick the mode
per route.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md`; find the project's loader convention
2. **Pick the rendering mode** per route
3. **Data loading** on the server
4. **Hydration** safety
5. **Caching**
6. **SEO**
7. **Errors**
8. **Performance**

## The Process

- **Modes:** static (SSG) for public, rarely changing pages; incremental/revalidated for
  semi-dynamic; SSR for per-request/personalised; client-only for highly interactive
  authenticated widgets.
- **Data loading:** server components, `getServerSideProps`, `load`, controller model - whichever
  the project uses.
- **Hydration:** server and client render the same markup - no `Date.now()`, random ids, `window`
  access or locale differences during render; guard browser-only code in effects.
- **Caching:** set `Cache-Control`/revalidate deliberately.
- **SEO:** unique title/description per page, canonical URL, structured data, sitemap, correct
  status codes (404/301) from the server.
- **Errors:** error and not-found boundaries per route; log server render errors.
- **Performance:** stream where supported, avoid waterfalls (parallel fetches), measure TTFB and LCP.

## Key Principles

- Rendering mode per route
- Same markup on server and client
- Never cache personalised pages publicly
- Secrets and server-only modules never reach the client bundle

## Transition

Hydration bugs -> `debugging`; performance work -> `performance-optimizer`; then `@reviewer`.
