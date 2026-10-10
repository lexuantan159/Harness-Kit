---
name: docker-containerization
description: Write or review Dockerfiles and compose files - small, secure, reproducible images with fast builds. Use when containerising an app, optimising image size/build time, or reviewing container security.
---

# Docker containerisation

## Dockerfile
- Pin the base image (`eclipse-temurin:17-jre-alpine`, `node:20-slim`, `python:3.12-slim`) - no `latest`.
- Multi-stage: build stage with SDK/dev deps, runtime stage with only the artefact.
- Order layers for cache: copy dependency manifests, install deps, then copy source.
- `.dockerignore`: `.git`, `node_modules`, `target`, `.env`, local secrets, docs.
- Run as non-root (`USER app`), read-only filesystem where possible, no secrets in `ENV`/`ARG`
  or layers (use build secrets / runtime env).
- One process per container; `HEALTHCHECK` or orchestrator probes; exec-form `CMD`/`ENTRYPOINT`
  so signals reach the app; graceful shutdown.
- JVM: container-aware memory flags (`-XX:MaxRAMPercentage=75`).

## Compose (local dev)
Named volumes for data, healthchecks + `depends_on: condition: service_healthy`, env from
`.env` (git-ignored), ports bound to `127.0.0.1` for databases.

## Verify
`docker build`, image size (`docker images`), run and hit the health endpoint, scan
(`docker scout cves` / `trivy image`).
