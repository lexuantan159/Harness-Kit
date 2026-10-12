---
name: server-side-rendering
description: Implement or debug server-side rendering / static generation (Next.js, Nuxt, SvelteKit, Thymeleaf, Razor) - data loading, hydration, caching, SEO. Use for SSR pages, hydration errors or SEO work.
---

# Server-side rendering

1. **Pick the rendering mode per route**: static (SSG) for public, rarely changing pages;
   incremental/revalidated for semi-dynamic; SSR for per-request/personalised; client-only for
   highly interactive authenticated widgets.
2. **Data loading** on the server through the project's loader convention (server components,
   `getServerSideProps`, `load`, controller model). Never expose secrets or server-only modules to
   the client bundle.
3. **Hydration** - server and client must render the same markup: no `Date.now()`, random ids,
   `window` access or locale differences during render; guard browser-only code in effects.
4. **Caching** - set `Cache-Control`/revalidate deliberately; never cache personalised pages publicly.
5. **SEO** - unique title/description per page, canonical URL, structured data, sitemap, correct
   status codes (404/301) from the server.
6. **Errors** - error and not-found boundaries per route; log server render errors.
7. **Performance** - stream where supported, avoid waterfalls (parallel fetches), measure TTFB and LCP.
