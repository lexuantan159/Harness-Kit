---
name: fullstack-architecture
description: Make and document architecture decisions across front end, back end, data and infrastructure - boundaries, layering, integration patterns - keeping the system simple. Use for new modules/services, cross-layer features, or "how should we structure X".
---

# Full-stack architecture

1. **Start from what exists** - `docs/ai/context/ARCHITECTURE.md`. New designs must fit the
   current style unless there is a recorded reason to change it.
2. **Boundaries** - group by business capability; each module owns its data; communicate through
   explicit interfaces (API, events), not shared tables.
3. **Layering** - UI -> API/controller -> application/service -> domain -> infrastructure.
   Dependencies point inwards; no business logic in controllers, UI or SQL.
4. **Prefer a modular monolith** until there is a concrete need (independent scaling, team
   autonomy, different release cadence) for separate services.
5. **Integration** - sync (HTTP) when the caller needs the answer now; async (events/queue) for
   decoupling and resilience - with idempotent consumers and an outbox for reliability.
6. **Cross-cutting** - authn/z, config, logging/tracing, error format, i18n decided once, centrally.
7. **Document** decisions as ADRs (`docs/ai/decisions/`) and update ARCHITECTURE.md with a
   mermaid diagram (`mermaid-diagrams`).
