---
name: legacy-assessment
description: Use when onboarding onto old code, before a migration, or when asked "how bad is this code". Assesses a legacy codebase or module - structure, health, risks, tech debt and a safe modernisation path.
---

# Legacy Assessment

Describe how healthy an old codebase is, what can go wrong, and the safest way to improve it.

<HARD-GATE>
Do NOT change code during an assessment, and never recommend a "big rewrite" without explicit
business sign-off. The output is a report.
</HARD-GATE>

## Anti-Pattern: "Burn It Down"

Rewrites lose the undocumented behaviour that keeps the business running. Wrap, test and replace
flow by flow instead.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` if it exists; otherwise `scout` first
2. **Inventory**
3. **Health signals**
4. **Risk register**
5. **Modernisation path**
6. **Save** to `docs/ai/assessments/legacy-<area>.md`

## The Process

**Inventory** - languages, frameworks and versions (EOL?), build tool, modules, LOC per module
(`git ls-files | xargs wc -l` or `cloc`), external integrations, data stores.

**Health signals**
- Tests: do they exist, run and pass? Coverage of core flows?
- Churn x complexity hotspots: `git log --format= --name-only | sort | uniq -c | sort -rn | head -20`
  cross-checked with the biggest/most complex files.
- Dependencies: outdated or vulnerable (`mvn versions:display-dependency-updates`, `npm outdated`,
  `pip list --outdated`, OWASP/`npm audit`).
- Coupling: god classes, circular dependencies, shared mutable state, business logic in UI/SQL.
- Operability: logging, config handling, secrets in code, build reproducibility.

**Risk register** - table: risk, evidence (path), impact, likelihood, mitigation.

**Modernisation path**
- First: characterisation tests around the flows you will touch.
- Then: strangler-fig - new code behind a seam, migrate flow by flow, delete old code.
- Order by value/risk.

## Key Principles

- Evidence (paths, numbers) for every finding
- Tests before changes
- Strangle, don't rewrite
- Value/risk decides the order

## Transition

Feed the risk register into tech-debt tracking; each modernisation step becomes a `/plan`.
