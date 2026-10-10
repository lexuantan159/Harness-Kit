---
applyTo: "**/{test,tests,__tests__,spec,src/test}/**"
---

# Testing

- Test behaviour through public interfaces; one scenario per test; descriptive names.
- Cover happy path, edge cases, invalid input and permission failures.
- Deterministic: inject clocks, no network, no sleeps, no shared mutable fixtures.
- Never weaken an assertion or delete a test to make it pass.
- Patterns: `.claude/references/testing-patterns.md`.
