# Skills index

Each skill is a folder with a `SKILL.md`. Claude Code loads them from `.claude/skills/`;
other agents can read them directly. Lifecycle: planning -> exploration -> build -> quality -> delivery.

| Stage | Skills |
|---|---|
| Meta | `using-agent-skills`, `find-skills`, `skill-creator`, `ponytail` |
| 1. Planning | `brainstorming`, `business-context`, `idea-assessment`, `requirements-analysis`, `spec-driven-development`, `technology-evaluation`, `writing-plans` |
| 2. Exploration | `scout`, `ast-grep`, `legacy-assessment` |
| 3. Backend | `api-design`, `api-development`, `authentication`, `caching`, `database-design`, `error-handling`, `openapi`, `real-time-features` |
| 4. Frontend | `frontend-development`, `css-styling`, `form-builder`, `server-side-rendering` |
| 5. Quality | `debugging`, `bug-fixing`, `code-review-checklist`, `code-simplification`, `incremental-implementation`, `observability`, `performance-optimizer`, `security-audit`, `senior-review`, `subagent-driven-development`, `test-driven-development`, `testing-strategies` |
| 6. Delivery | `deployment-strategy`, `devops-automation`, `docker-containerization`, `fullstack-architecture`, `git-workflows`, `mermaid-diagrams`, `technical-writing` |
| Stack packs | installed per project from the kit's `stacks/` (e.g. `java-development`, `node-development`, `python-development`) |

Naming note: `code-review-checklist`, `security-audit` and `deployment-strategy` are named so they
do not collide with the `/review`, `/deploy` commands and Claude Code's built-in skills.

Add project-specific skills with `skill-creator`; they are yours and survive harness updates.
