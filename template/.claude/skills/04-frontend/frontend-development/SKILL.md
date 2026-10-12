---
name: frontend-development
description: Build or change UI components and pages - structure, state, data fetching, accessibility, tests - in the project's framework. Use for any front-end feature or bug.
---

# Frontend development

1. **Match the project** - framework (React/Vue/Angular/Svelte/server templates), component
   library, state management, styling approach, folder layout. Copy the nearest similar component.
2. **Reuse** - existing components, hooks/composables, API client and design tokens before new ones.
3. **Component design** - small, single-purpose; props in, events out; derive state instead of
   duplicating it; lift state only as far as needed.
4. **Data** - use the project's fetching layer (React Query, SWR, services); handle loading, empty,
   error and success states explicitly; cancel stale requests.
5. **Accessibility** - semantic elements, labels, keyboard operation, focus management, contrast
   (`.claude/references/accessibility.md`).
6. **Security** - no `innerHTML`/`v-html`/`dangerouslySetInnerHTML` with untrusted data; no secrets
   in the bundle; authorization is enforced server-side.
7. **Performance** - avoid unnecessary re-renders, lazy-load heavy routes, size images.
8. **Tests** - Testing Library style: render, interact like a user, assert visible outcome.
   Snapshot tests only for stable leaf components.
9. i18n: no hard-coded user-facing strings if the project uses translations.
