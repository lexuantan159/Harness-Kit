---
name: deployment-strategy
description: Use for /deploy, release planning, or any risky production change. Plans safe releases - environments, rollout strategy (rolling, blue-green, canary, feature flags), migrations, health checks and rollback.
---

# Deployment Strategy

Plan a release so it can be watched, stopped and rolled back.

<HARD-GATE>
Do NOT trigger a deployment, push images or change cloud resources. Agents prepare plans and
files; humans trigger production deployments.
</HARD-GATE>

## Anti-Pattern: "Deploy And Hope"

A release without a health gate, a rollback trigger and a tested rollback step turns a small bug
into an outage.

## Checklist

1. **Context** - read `docs/ai/context/ARCHITECTURE.md` (environments, build, run)
2. **Environments** - promote one artefact
3. **Rollout** strategy
4. **Database** compatibility during rollout
5. **Health** gates and smoke tests
6. **Rollback** command and trigger
7. **Release checklist**

## The Process

- **Environments:** dev -> test/staging -> prod with the same artefact promoted (build once).
  Config per environment from env vars / secret store.
- **Rollout:**
  - rolling: default for stateless services with backward-compatible changes
  - blue-green: instant switch and rollback; needs double capacity
  - canary: small % first, watch error rate/latency, then expand
  - feature flags: decouple deploy from release; remove the flag after rollout
- **Database:** expand/contract migrations so old and new code both work (`database-design`).
- **Health:** readiness checks gate traffic; smoke tests after deploy.
- **Rollback:** documented, tested command or pipeline step; know whether data changes are
  reversible; define the trigger (e.g. error rate > X% for 5 min).
- **Release checklist:** changelog, migrations reviewed, config/secrets in place, monitoring
  dashboards and alerts ready, owner on call.

## Key Principles

- Build once, promote everywhere
- Old and new code coexist during rollout
- A rollback is tested before it is needed
- Humans press the button

## Transition

Pipeline changes -> `devops-automation`; images -> `docker-containerization`; the plan goes to
the human who runs the release.
