---
name: devops-automation
description: Use for pipeline setup, slow or flaky pipelines, or reviewing CI files. Creates or improves CI/CD pipelines (GitHub Actions, GitLab CI, Azure DevOps, Jenkins) - build, test, lint, security scan, package, deploy - fast and secure.
---

# DevOps Automation

Make every commit build, test and package the same way, quickly and without exposing secrets.

<HARD-GATE>
Do NOT put secrets in pipeline files, and do NOT run pipelines or deployments from here. Production
deploys need manual approval and must be traceable to a commit.
</HARD-GATE>

## Anti-Pattern: "CI Has Its Own Scripts"

Pipelines that reinvent the build drift from what developers run locally. CI should call the same
commands (Makefile, npm scripts, mvnw).

## Checklist

1. **Context** - find the CI system already in the repo (`.gitlab-ci.yml`, `.github/workflows/`, ...)
2. **Stages** in order
3. **Pin** versions
4. **Cache** dependencies
5. **Secrets** from the CI store only
6. **Speed** - fail fast, parallelise
7. **Protect** branches and production

## The Process

- **Stages:** build -> unit test -> lint/format -> security (SAST, dependency, secret scan) ->
  package (image/artefact, tagged with commit SHA) -> integration tests -> deploy dev ->
  (approval) -> prod.
- **Pinning:** runner images, actions by SHA/tag, tool versions.
- **Caching:** Maven/Gradle/npm/pip keyed on lock files.
- **Secrets:** masked, least-privilege tokens; OIDC to cloud if possible.
- **Speed:** cheap checks first; independent jobs in parallel.
- **Protection:** required checks and review before merge on protected branches.
- **Review checklist:** missing tests/lint in CI, secrets in YAML, `latest` tags, no cache, deploy
  without approval, artefact rebuilt per environment, no rollback job.

## Key Principles

- Same commands locally and in CI
- Pinned and cached
- Secrets only from the secret store
- Production needs a human approval

## Transition

Rollout and rollback design -> `deployment-strategy`; images -> `docker-containerization`; the
pipeline change goes to `@reviewer`.
