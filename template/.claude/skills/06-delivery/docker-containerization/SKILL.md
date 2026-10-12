---
name: docker-containerization
description: Use when containerising an app, optimising image size/build time, or reviewing container security. Writes or reviews Dockerfiles and compose files - small, secure, reproducible images with fast builds.
---

# Docker Containerisation

Produce small, secure, reproducible images that start and stop cleanly.

<HARD-GATE>
Do NOT put secrets in `ENV`, `ARG` or any image layer, and do NOT push images from here. Use
build secrets or runtime environment variables.
</HARD-GATE>

## Anti-Pattern: "FROM latest, Run As Root"

Unpinned base images make builds unreproducible; root containers turn any exploit into a host
problem.

## Checklist

1. **Context** - read the build files and any existing Dockerfile/compose
2. **Base image** - pinned
3. **Multi-stage** build
4. **Layer order** for cache
5. **`.dockerignore`**
6. **Runtime hardening**
7. **Process and signals**
8. **Verify**

## The Process

**Dockerfile**
- Pin the base image (`eclipse-temurin:17-jre-alpine`, `node:20-slim`, `python:3.12-slim`).
- Multi-stage: build stage with SDK/dev deps, runtime stage with only the artefact.
- Layers: copy dependency manifests, install deps, then copy source.
- `.dockerignore`: `.git`, `node_modules`, `target`, `.env`, local secrets, docs.
- Run as non-root (`USER app`), read-only filesystem where possible.
- One process per container; `HEALTHCHECK` or orchestrator probes; exec-form `CMD`/`ENTRYPOINT`
  so signals reach the app; graceful shutdown.
- JVM: container-aware memory flags (`-XX:MaxRAMPercentage=75`).

**Compose (local dev)** - named volumes for data, healthchecks +
`depends_on: condition: service_healthy`, env from `.env` (git-ignored), database ports bound to
`127.0.0.1`.

**Verify** - `docker build`, image size (`docker images`), run and hit the health endpoint, scan
(`docker scout cves` / `trivy image`).

## Key Principles

- Pinned, multi-stage, non-root
- No secrets in layers
- Signals reach the app
- Scanned before shipped

## Transition

Pipeline build and push -> `devops-automation`; rollout -> `deployment-strategy`; then `@reviewer`.
