---
name: css-styling
description: Use for layout, theming, responsive or visual bugs. Writes maintainable, responsive, accessible CSS using the project's styling system (CSS modules, Tailwind, SCSS, CSS-in-JS, design tokens).
---

# CSS Styling

Style UI with the project's system so it is consistent, responsive and accessible.

## Anti-Pattern: "Just One Magic Value"

Hard-coded colours, spacing and `!important` accumulate into a second, undocumented design
system. Use the tokens.

## Checklist

1. **Context** - find the project's styling system and tokens (colours, spacing, radii, typography)
2. **Layout**
3. **Responsive**
4. **Specificity**
5. **Accessibility**
6. **Theming**
7. **Check in the browser**

## The Process

- **System:** no new magic values when a token exists; no second styling approach.
- **Layout:** flexbox for one axis, grid for two; avoid absolute positioning for layout.
- **Responsive:** mobile-first, breakpoints from the design system, fluid widths, no horizontal
  scroll at 320px, images `max-width: 100%`.
- **Specificity:** low and flat. Class selectors; no `!important` except to override third-party
  CSS (comment why); no IDs for styling.
- **Accessibility:** contrast >= 4.5:1 for text, visible `:focus-visible` styles, respect
  `prefers-reduced-motion`, don't convey meaning by colour alone
  (`.claude/references/accessibility.md`).
- **Theming:** CSS custom properties; dark mode via `prefers-color-scheme` or a theme attribute.
- **Browser check:** mobile and desktop widths, light and dark, keyboard-only.

## Key Principles

- Tokens over values
- Low, flat specificity
- Mobile-first
- Visible focus, sufficient contrast

## Transition

Component behaviour stays in `frontend-development`; visual changes go to `@reviewer` with
screenshots at mobile and desktop widths.
