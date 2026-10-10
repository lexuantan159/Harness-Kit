---
applyTo: "**/*.{java,kt,ts,tsx,js,jsx,py,cs,go,vue,svelte}"
---

# Code style

- Minimal code: YAGNI -> reuse existing code -> stdlib -> existing dependency -> new code.
- No interface with a single implementation, no unused parameters/options, no single-use helpers.
- Names from the domain glossary (`docs/ai/context/BUSINESS.md`); comments explain why, not what.
- Handle errors with the project's central mechanism; never swallow exceptions.
- Keep functions small and flat: guard clauses over nested conditionals.
