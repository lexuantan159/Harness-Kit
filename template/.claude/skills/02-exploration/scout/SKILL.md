---
name: scout
description: Use at the start of any task in code you have not read yet, before planning or changing it. Quickly maps an unfamiliar area of the codebase - entry points, modules, data flow, tests, conventions.
---

# Scout

Produce a short, accurate map of an area. Not a file dump.

## Anti-Pattern: "Read Everything"

Opening file after file fills the context without producing a map. Start from the entry point
and follow the flow.

## Checklist

1. **Context docs** - read `docs/ai/context/ARCHITECTURE.md` (and `SCHEMA.md` if data is involved)
2. **Shape** - build files, top-level folders, recent activity
3. **Find the entry point** for the behaviour
4. **Trace** entry point -> service/domain -> persistence/external calls
5. **Tests** - where they live, how they run, which fixtures they use
6. **Conventions** - the pattern to copy
7. **Write the map** (<= 25 lines)

## The Process

- **Shape:** pom.xml, build.gradle, package.json, pyproject.toml, go.mod, *.csproj; top-level
  folders; `git log --oneline -20 -- <area>`.
- **Entry point:** route/controller, CLI command, job, event handler, UI page. Prefer the
  codegraph MCP tools when connected; else `ast-grep` / text search.
- **Trace:** note each hop as file:line.
- **Conventions:** naming, layering, error handling, DTO mapping, logging.
- **Broad sweeps:** delegate to an explorer-type subagent and keep only the map.

**Output**
```
Area: ...
Entry points: path:line ...
Flow: A -> B -> C
Data: tables/entities ...
Tests: path, command
Pattern to copy: path
Surprises / risks: ...
```

## Key Principles

- A map, not a dump
- Follow the flow from the entry point
- Every claim has a file:line
- Name the pattern to copy

## Transition

The map feeds `writing-plans` (planning), `debugging` (bugs) or `legacy-assessment` (health).
