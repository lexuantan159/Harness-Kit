# Accessibility Checklist (WCAG 2.2 AA)

Quick reference for accessible UI. Used by the `frontend-development`, `css-styling` and
`form-builder` skills, `reviewer` and `pr-review`. Code examples are HTML/CSS/TypeScript; apply the
same rule in the project's own framework.

## Table of Contents

- [Semantic Structure](#semantic-structure)
- [Forms](#forms)
- [Keyboard & Focus](#keyboard--focus)
- [Visual Design](#visual-design)
- [Images & Media](#images--media)
- [Dynamic Content & ARIA](#dynamic-content--aria)
- [Testing](#testing)
- [WCAG Quick Reference](#wcag-quick-reference)

## Semantic Structure

- [ ] Headings in order (one `h1`, no skipped levels)
- [ ] Landmarks: `header`, `nav`, `main`, `footer`; lists for lists
- [ ] Buttons for actions, links for navigation
- [ ] Page has `lang` and a unique `<title>`

```html
<!-- Good: focusable, keyboard-operable, announced as a button -->
<button type="button" onclick="save()">Save</button>

<!-- Bad: no keyboard support, no role, not announced -->
<div class="btn" onclick="save()">Save</div>
```

## Forms

- [ ] Every form control has a visible `<label>`
- [ ] Errors linked to their field via `aria-describedby`, with `aria-invalid`
- [ ] Required fields marked visually and with `aria-required`
- [ ] Correct `type`, `inputmode` and `autocomplete`

```html
<label for="email">Email</label>
<input id="email" type="email" autocomplete="email" aria-required="true"
       aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Enter an email address like name@example.com</p>
```

## Keyboard & Focus

- [ ] All functionality works with keyboard only; logical tab order; no keyboard traps
- [ ] Visible focus indicator (`:focus-visible`)
- [ ] Focus moved into dialogs on open and restored to the trigger on close
- [ ] No positive `tabindex`

```css
:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}
```

```typescript
// Dialog: move focus in, restore it on close
const trigger = document.activeElement as HTMLElement;
dialog.showModal();                 // native <dialog> traps focus and handles Escape
dialog.addEventListener('close', () => trigger.focus(), { once: true });
```

## Visual Design

- [ ] Text contrast >= 4.5:1 (3:1 for large text and UI components)
- [ ] Meaning not conveyed by colour alone (add icon, text or pattern)
- [ ] Target size >= 24x24 CSS px
- [ ] Zoom to 200% and reflow at 320px width without loss of content
- [ ] Respects `prefers-reduced-motion`; no auto-playing motion > 5s without pause

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Images & Media

- [ ] Images have `alt`; empty `alt=""` for decorative images
- [ ] Icon-only buttons have an accessible name (`aria-label` or visually hidden text)
- [ ] Video has captions; audio has a transcript

```html
<img src="chart.png" alt="Revenue grew 20% from Q1 to Q2">
<img src="divider.svg" alt="">
<button type="button" aria-label="Close dialog"><svg aria-hidden="true">...</svg></button>
```

## Dynamic Content & ARIA

- [ ] Dynamic updates announced (`aria-live`) where needed
- [ ] ARIA only when HTML can't express it; never change native semantics
- [ ] Custom widgets follow the WAI-ARIA Authoring Practices keyboard patterns

```html
<!-- Announced politely when its text changes -->
<div aria-live="polite" id="status"></div>
```

## Testing

- [ ] Keyboard walk-through of every changed screen (Tab, Shift+Tab, Enter, Space, Escape)
- [ ] Automated scan: axe DevTools / Lighthouse; in tests, `jest-axe` / `@axe-core/playwright`
- [ ] Screen reader spot check (VoiceOver/NVDA)
- [ ] Zoom to 200% and a 320px-wide viewport

```typescript
// Playwright + axe: fail the test on violations
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toEqual([]);
```

## WCAG Quick Reference

| Area | Requirement (AA) | Check |
|---|---|---|
| Contrast | 4.5:1 text, 3:1 large text and UI components | DevTools contrast picker |
| Keyboard | Everything operable, no traps, logical order | Tab through the page |
| Focus | Visible indicator; not hidden behind sticky content | `:focus-visible` styles |
| Labels | Every control has a programmatic name | axe, screen reader |
| Errors | Identified in text and linked to the field | Submit an invalid form |
| Target size | >= 24x24 CSS px | Measure in DevTools |
| Reflow | No loss at 320px width / 200% zoom | Resize the viewport |
| Motion | Respect `prefers-reduced-motion` | OS setting |
| Status messages | Announced without moving focus | `aria-live`, screen reader |
