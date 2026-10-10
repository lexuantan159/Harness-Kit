# Accessibility checklist (WCAG 2.2 AA)

- [ ] Semantic HTML: headings in order, landmarks (`header`, `nav`, `main`), lists, buttons vs links
- [ ] Every form control has a visible `<label>`; errors linked via `aria-describedby`
- [ ] All functionality works with keyboard only; logical tab order; no keyboard traps
- [ ] Visible focus indicator (`:focus-visible`); focus moved to dialogs and restored on close
- [ ] Text contrast >= 4.5:1 (3:1 for large text and UI components)
- [ ] Meaning not conveyed by colour alone
- [ ] Images have `alt` (empty `alt=""` for decorative)
- [ ] Target size >= 24x24 CSS px
- [ ] Respects `prefers-reduced-motion`; no auto-playing motion > 5s without pause
- [ ] Page has `lang`, a unique `<title>`; zoom to 200% without loss of content
- [ ] Dynamic updates announced (`aria-live`) where needed; ARIA only when HTML can't express it

Test: keyboard walk-through, axe DevTools / Lighthouse, screen reader spot check (VoiceOver/NVDA).
