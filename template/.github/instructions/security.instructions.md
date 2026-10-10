---
applyTo: "**"
---

# Security

- Validate all external input at the boundary; parameterised queries only; encode output.
- Check authorization including object ownership on every request, server-side.
- Never hard-code or log secrets, tokens, passwords or personal data.
- No `eval`, unsafe deserialisation, or shell commands built from input.
- Full checklist: `.claude/references/security.md`.
