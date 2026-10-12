---
name: legacy-assessment
description: Assess a legacy codebase or module - structure, health, risks, tech debt and a safe modernisation path. Use when onboarding onto old code, before a migration, or when asked "how bad is this code".
---

# Legacy assessment

## 1. Inventory
Languages, frameworks and versions (EOL?), build tool, modules, LOC per module
(`git ls-files | xargs wc -l` or `cloc`), external integrations, data stores.

## 2. Health signals
- Tests: do they exist, run and pass? Coverage of core flows?
- Churn x complexity hotspots: `git log --format= --name-only | sort | uniq -c | sort -rn | head -20`
  cross-checked with the biggest/most complex files.
- Dependencies: outdated or vulnerable (`mvn versions:display-dependency-updates`, `npm outdated`,
  `pip list --outdated`, OWASP/`npm audit`).
- Coupling: god classes, circular dependencies, shared mutable state, business logic in UI/SQL.
- Operability: logging, config handling, secrets in code, build reproducibility.

## 3. Risk register
Table: risk, evidence (path), impact, likelihood, mitigation.

## 4. Modernisation path
- First: characterisation tests around the flows you will touch.
- Then: strangler-fig - new code behind a seam, migrate flow by flow, delete old code.
- Order by value/risk. Never "big rewrite" without explicit business sign-off.

Output to `docs/ai/assessments/legacy-<area>.md`; feed findings into tech-debt tracking.
