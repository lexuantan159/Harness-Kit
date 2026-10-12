---
name: deployment-strategy
description: Plan safe releases - environments, rollout strategy (rolling, blue-green, canary, feature flags), migrations, health checks and rollback. Use for /deploy, release planning, or any risky production change.
---

# Deployment strategy

1. **Environments** - dev -> test/staging -> prod with the same artefact promoted (build once).
   Config per environment from env vars / secret store.
2. **Rollout**
   - Rolling: default for stateless services with backward-compatible changes.
   - Blue-green: instant switch and rollback; needs double capacity.
   - Canary: small % first, watch error rate/latency, then expand.
   - Feature flags: decouple deploy from release; remove the flag after rollout.
3. **Database** - expand/contract migrations so old and new code both work during rollout
   (`database-design`).
4. **Health** - readiness checks gate traffic; smoke tests after deploy.
5. **Rollback** - documented, tested command or pipeline step; know whether data changes are
   reversible. Define the rollback trigger (e.g. error rate > X% for 5 min).
6. **Release checklist** - changelog, migrations reviewed, config/secrets in place, monitoring
   dashboards and alerts ready, owner on call.

Agents prepare plans and files; humans trigger production deployments.
