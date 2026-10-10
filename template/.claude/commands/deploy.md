---
description: Set up or review a CI/CD pipeline and deployment (Docker, GitHub Actions / GitLab CI, environments)
argument-hint: "<setup|review> [target, e.g. gitlab-ci, github-actions, docker]"
---

Deployment task: $ARGUMENTS

Use the `deployment-strategy`, `devops-automation` and `docker-containerization` skills.

- **setup**: detect the build tool and existing CI files; propose a pipeline (build -> test ->
  lint -> security scan -> package -> deploy per environment) as a plan and wait for approval.
  Secrets come from the CI secret store, never from files in the repo.
- **review**: read the existing pipeline/Dockerfiles and report issues: missing tests or caching,
  secrets exposure, unpinned images, root containers, no rollback, no health checks.

Never run a deployment, push images or change cloud resources from here. Produce files and
instructions; the human runs them.
