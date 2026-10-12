# Skills index

Each skill is a folder with a `SKILL.md`. Claude Code loads them from `.claude/skills/`;
other agents can read them directly. Lifecycle: planning -> exploration -> build -> quality -> delivery.

In the harness kit the skills are grouped in one folder per stage (`skills/05-quality/debugging/`).
Claude Code only discovers `.claude/skills/<name>/SKILL.md`, so the installer drops the stage
folder: in a project the path is `.claude/skills/<name>/SKILL.md`. Refer to skills by name.

| Kit folder | Skills |
|---|---|
| `00-meta` | `using-agent-skills`, `find-skills`, `skill-creator`, `ponytail` |
| `01-planning` | `brainstorming`, `business-context`, `idea-assessment`, `requirements-analysis`, `spec-driven-development`, `technology-evaluation`, `writing-plans` |
| `02-exploration` | `scout`, `ast-grep`, `legacy-assessment` |
| `03-backend` | `api-design`, `api-development`, `authentication`, `caching`, `database-design`, `error-handling`, `openapi`, `real-time-features` |
| `04-frontend` | `frontend-development`, `css-styling`, `form-builder`, `server-side-rendering` |
| `05-quality` | `debugging`, `bug-fixing`, `code-review-checklist`, `code-simplification`, `incremental-implementation`, `observability`, `performance-optimizer`, `security-audit`, `senior-review`, `subagent-driven-development`, `test-driven-development`, `testing-strategies` |
| `06-delivery` | `deployment-strategy`, `devops-automation`, `docker-containerization`, `fullstack-architecture`, `git-workflows`, `mermaid-diagrams`, `technical-writing` |
| Stack packs | installed per project from the kit's `stacks/` (e.g. `java-development`, `node-development`, `python-development`) |

Naming note: `code-review-checklist`, `security-audit` and `deployment-strategy` are named so they
do not collide with the `/review`, `/deploy` commands and Claude Code's built-in skills.

Add project-specific skills with `skill-creator`; they are yours and survive harness updates.
