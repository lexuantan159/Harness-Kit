---
name: frontend-development
description: Use for any front-end feature or bug. Builds or changes UI components and pages - structure, state, data fetching, accessibility, tests - in the project's framework.
---

# Frontend Development

Build UI that matches the project, handles every state, and works for every user.

## Anti-Pattern: "A New Component For Everything"

A fresh component, hook or styling approach for each feature fragments the UI. Copy the nearest
similar component and reuse what exists.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md`; match framework, component library,
   state management, styling and folder layout
2. **Reuse** before creating
3. **Component design**
4. **Data and states**
5. **Accessibility**
6. **Security**
7. **Performance**
8. **Tests**

## The Process

- **Match the project:** React/Vue/Angular/Svelte/server templates; copy the nearest similar component.
- **Reuse:** existing components, hooks/composables, API client and design tokens before new ones.
- **Component design:** small, single-purpose; props in, events out; derive state instead of
  duplicating it; lift state only as far as needed.
- **Data:** use the project's fetching layer (React Query, SWR, services); handle loading, empty,
  error and success states explicitly; cancel stale requests.
- **Accessibility:** semantic elements, labels, keyboard operation, focus management, contrast
  (`.claude/references/accessibility.md`).
- **Security:** no `innerHTML`/`v-html`/`dangerouslySetInnerHTML` with untrusted data; no secrets
  in the bundle; authorization is enforced server-side.
- **Performance:** avoid unnecessary re-renders, lazy-load heavy routes, size images.
- **Tests:** Testing Library style - render, interact like a user, assert the visible outcome.
  Snapshot tests only for stable leaf components.
- **i18n:** no hard-coded user-facing strings if the project uses translations.

## Key Principles

- Copy the nearest component
- Four states: loading, empty, error, success
- Keyboard and screen reader work
- The server enforces authorization

## Transition

Forms -> `form-builder`; styling -> `css-styling`; SSR pages -> `server-side-rendering`; then
`@tester` and `@reviewer`.
