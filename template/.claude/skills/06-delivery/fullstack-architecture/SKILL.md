---
name: fullstack-architecture
description: Use for new modules/services, cross-layer features, integration decisions, changes to layering and boundaries, or "how should we structure X". Makes and documents architecture decisions across front end, back end, data and infrastructure, keeping the system simple.
---

# Full-Stack Architecture

Make architecture decisions that fit the existing system and are written down.

<HARD-GATE>
Do NOT change the established architecture style (new service, new layer, new integration style)
without a recorded decision (ADR) approved by the user.
</HARD-GATE>

## Anti-Pattern: "Microservices From Day One"

Splitting into services before there is a concrete need adds network failures, deployments and
data consistency problems with no benefit.

## Checklist

1. **Context** - start from `docs/ai/context/ARCHITECTURE.md`; new designs fit the current style
2. **Boundaries** by business capability
3. **Layering** with inward dependencies
4. **Deployment shape** - modular monolith unless there is a concrete need
5. **Integration** style per interaction
6. **Cross-cutting** concerns decided once
7. **Document** as an ADR and update ARCHITECTURE.md

## The Process

- **Boundaries:** group by business capability; each module owns its data; communicate through
  explicit interfaces (API, events), not shared tables.
- **Layering:** UI -> API/controller -> application/service -> domain -> infrastructure. No
  business logic in controllers, UI or SQL.
- **Separate services** only for independent scaling, team autonomy or a different release
  cadence.
- **Integration:** sync (HTTP) when the caller needs the answer now; async (events/queue) for
  decoupling and resilience - with idempotent consumers and an outbox for reliability.
- **Cross-cutting:** authn/z, config, logging/tracing, error format, i18n - decided centrally.
- **Document:** ADRs in `docs/ai/decisions/` (`technical-writing`); a mermaid diagram in
  ARCHITECTURE.md (`mermaid-diagrams`).

## Key Principles

- Fit the existing style unless an ADR says otherwise
- Modules own their data
- Dependencies point inwards
- Simplest deployment shape that works

## Transition

The approved ADR feeds `writing-plans`; boundary changes go through `senior-review`.
