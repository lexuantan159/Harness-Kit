---
name: css-styling
description: Write maintainable, responsive, accessible CSS using the project's styling system (CSS modules, Tailwind, SCSS, CSS-in-JS, design tokens). Use for layout, theming, responsive or visual bugs.
---

# CSS styling

1. Use the project's system and tokens (colours, spacing, radii, typography). No new magic
   values when a token exists; no second styling approach.
2. Layout: flexbox for one axis, grid for two; avoid absolute positioning for layout.
3. Responsive: mobile-first, breakpoints from the design system, fluid widths, no horizontal scroll
   at 320px, images `max-width: 100%`.
4. Specificity: low and flat. Class selectors; no `!important` except to override third-party CSS
   (comment why); no IDs for styling.
5. Accessibility: contrast >= 4.5:1 for text, visible `:focus-visible` styles, respect
   `prefers-reduced-motion`, don't convey meaning by colour alone.
6. Theming: CSS custom properties; dark mode via `prefers-color-scheme` or a theme attribute.
7. Check in the browser at mobile and desktop widths, light and dark, keyboard-only.
