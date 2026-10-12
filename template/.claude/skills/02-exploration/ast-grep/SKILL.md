---
name: ast-grep
description: Use for refactors across many files, finding all usages of an API shape, or when grep returns too much noise. Structural code search and safe codemods with ast-grep (sg) - find call sites, patterns and anti-patterns by syntax, not text.
---

# ast-grep (sg)

Search and rewrite code by its syntax tree, so matches are exact and codemods are safe.

<HARD-GATE>
Do NOT apply a rewrite (`-U`) before previewing it. After applying, run build + tests and review
`git diff` before reporting done.
</HARD-GATE>

## Anti-Pattern: "Regex Refactor"

Text replacement across many files breaks strings, comments and similar-looking code. Match the
syntax, not the characters.

## Checklist

1. **Check availability** - `sg --version`
2. **Search** with a pattern; refine until matches are exactly right
3. **Preview** the rewrite
4. **Apply**, then build + tests + `git diff`

## The Process

**Availability** - if missing, fall back to text search and say so (installing it is the user's
call: `npm i -g @ast-grep/cli` or `brew install ast-grep`).

**Search**
```sh
sg run -l java -p 'log.debug($MSG)' src/                 # every log.debug call
sg run -l ts   -p 'useEffect($FN, [])' src/              # effects with empty deps
sg run -l python -p 'requests.get($URL)' .               # calls without timeout
sg run -l java -p '$X.equals("$S")' src/                 # constant-on-the-right equals
```
`$X` matches one node, `$$$ARGS` matches many. Add `--json` for machine-readable output.

**Rewrite (codemod)**
```sh
sg run -l ts -p 'oldApi($A)' -r 'newApi($A)' src/         # preview
sg run -l ts -p 'oldApi($A)' -r 'newApi($A)' -U src/      # apply
```

**Rules (lint-like)** - put recurring patterns in `sgconfig.yml` + `rules/*.yml` and run
`sg scan` in CI.

## Key Principles

- Syntax over text
- Preview, apply, verify
- Fall back openly when sg is missing

## Transition

Blast-radius results go into the plan or research report; codemods go to `@reviewer` like any
other diff.
