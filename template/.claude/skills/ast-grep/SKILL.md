---
name: ast-grep
description: Structural code search and safe codemods with ast-grep (sg) - find call sites, patterns and anti-patterns by syntax, not text. Use for refactors across many files, finding all usages of an API shape, or when grep returns too much noise.
---

# ast-grep (sg)

Check availability: `sg --version`. If missing, fall back to text search and say so
(installing it is the user's call: `npm i -g @ast-grep/cli` or `brew install ast-grep`).

## Search
```sh
sg run -l java -p 'log.debug($MSG)' src/                 # every log.debug call
sg run -l ts   -p 'useEffect($FN, [])' src/              # effects with empty deps
sg run -l python -p 'requests.get($URL)' .               # calls without timeout
sg run -l java -p '$X.equals("$S")' src/                 # constant-on-the-right equals
```
`$X` matches one node, `$$$ARGS` matches many. Add `--json` for machine-readable output.

## Rewrite (codemod)
```sh
sg run -l ts -p 'oldApi($A)' -r 'newApi($A)' src/         # preview
sg run -l ts -p 'oldApi($A)' -r 'newApi($A)' -U src/      # apply
```
Always preview first, apply, then run build + tests and review `git diff`.

## Rules (lint-like)
Put recurring patterns in `sgconfig.yml` + `rules/*.yml` and run `sg scan` in CI.
