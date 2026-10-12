---
name: technical-writing
description: Use for any documentation task in the repo. Writes clear technical docs - READMEs, ADRs, runbooks, API guides, release notes, PR descriptions - for a named audience.
---

# Technical Writing

Write documents a named reader can act on, and that stay true.

## Anti-Pattern: "Docs For Everyone"

A document without a named reader explains too much to experts and too little to newcomers.
Decide who reads it and what they must be able to do afterwards.

## Checklist

1. **Audience and goal** - who reads it (new dev, ops on call, stakeholder) and what they must do
2. **Pick the template**
3. **Structure** - answer first
4. **Concrete** - runnable commands and real paths
5. **Short**
6. **Maintainable** - link, don't copy
7. **Test** every step as written

## The Process

- **Structure:** lead with the answer/outcome; then steps; then background. Headings that work as
  a table of contents.
- **Concrete:** exact commands in code blocks, real paths, expected output, versions.
- **Short:** plain words, active voice, one idea per paragraph, lists for steps and options.
- **Maintainable:** link to the source of truth instead of copying it; date or version anything
  that will drift.
- **Templates:**
  - README: what it is, quick start, configuration, development (build/test), deployment, support.
  - ADR: context, options, decision, consequences (`docs/ai/decisions/NNN-slug.md`).
  - Runbook: symptom, impact, diagnosis steps, fix/rollback, escalation.
  - PR: what, why, how tested, risks, screenshots.
- **Diagrams:** `mermaid-diagrams`.

## Key Principles

- A named reader
- Answer first
- Every step runnable as written
- Link the source of truth

## Transition

Docs ship in the same change as the code they describe and go to `@reviewer` with it.
