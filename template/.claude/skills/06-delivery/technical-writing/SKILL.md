---
name: technical-writing
description: Write clear technical docs - READMEs, ADRs, runbooks, API guides, release notes, PR descriptions - for a named audience. Use for any documentation task in the repo.
---

# Technical writing

1. **Audience and goal** - who reads it (new dev, ops on call, stakeholder) and what they must be
   able to do afterwards. Write for them.
2. **Structure** - lead with the answer/outcome; then steps; then background. Headings that work
   as a table of contents.
3. **Concrete** - exact commands in code blocks, real paths, expected output, versions.
   Every step runnable as written; test it.
4. **Short** - plain words, active voice, one idea per paragraph, lists for steps and options.
5. **Maintainable** - link to the source of truth instead of copying it; date or version
   anything that will drift.

## Templates
- README: what it is, quick start, configuration, development (build/test), deployment, support.
- ADR: context, options, decision, consequences (`docs/ai/decisions/NNN-slug.md`).
- Runbook: symptom, impact, diagnosis steps, fix/rollback, escalation.
- PR: what, why, how tested, risks, screenshots.
