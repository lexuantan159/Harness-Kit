---
name: devops-automation
description: Create or improve CI/CD pipelines (GitHub Actions, GitLab CI, Azure DevOps, Jenkins) - build, test, lint, security scan, package, deploy - fast and secure. Use for pipeline setup, slow or flaky CI, or pipeline review.
---

# DevOps automation

## Pipeline stages
build -> unit test -> lint/format -> security (SAST, dependency, secret scan) -> package
(image/artefact, tagged with commit SHA) -> integration tests -> deploy dev -> (approval) -> prod.

## Rules
- Reuse the CI system already in the repo (`.gitlab-ci.yml`, `.github/workflows/`, ...).
- Pin versions: runner images, actions by SHA/tag, tool versions.
- Cache dependencies (Maven/Gradle/npm/pip) keyed on lock files.
- Secrets only from the CI secret store, masked; least-privilege tokens; OIDC to cloud if possible.
- Fail fast: cheap checks first; run independent jobs in parallel.
- Same commands locally and in CI (Makefile/npm scripts/mvnw) - CI calls them, doesn't reinvent them.
- Protected branches: required checks, review before merge.
- Production deploys need manual approval and are traceable to a commit.

## Review checklist
Missing tests/lint in CI, secrets in YAML, `latest` tags, no cache, deploy without approval,
artefact rebuilt per environment, no rollback job.
