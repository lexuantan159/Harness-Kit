---
name: scout
description: Quickly map an unfamiliar area of the codebase - entry points, modules, data flow, tests, conventions - before planning or changing it. Use at the start of any task in code you have not read yet.
---

# Scout

Goal: a short, accurate map. Not a file dump.

1. **Context docs** - read `docs/ai/context/ARCHITECTURE.md` (and SCHEMA.md if data is involved).
2. **Shape** - build files (pom.xml, build.gradle, package.json, pyproject.toml, go.mod, *.csproj),
   top-level folders, `git log --oneline -20 -- <area>` for recent activity.
3. **Find the entry point** for the behaviour: route/controller, CLI command, job, event handler,
   UI page. Prefer the codegraph MCP tools when connected; else `ast-grep` / text search.
4. **Trace** entry point -> service/domain -> persistence/external calls. Note each hop file:line.
5. **Tests** - where the tests for this area live, how they are run, which fixtures they use.
6. **Conventions** - naming, layering, error handling, DTO mapping, logging pattern to copy.

## Output (<= 25 lines)
```
Area: ...
Entry points: path:line ...
Flow: A -> B -> C
Data: tables/entities ...
Tests: path, command
Pattern to copy: path
Surprises / risks: ...
```
For broad sweeps, delegate to an explorer-type subagent and keep only the map.
