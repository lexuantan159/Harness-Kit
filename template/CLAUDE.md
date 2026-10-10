# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

- Stack: {{STACK}}
- Default branch: `{{DEFAULT_BRANCH}}`
- Harness: harness-kit {{HARNESS_VERSION}} (managed files are listed in `.harness-manifest.json`)

## Verify commands

Run these before claiming any task is done. If one cannot run, say so and why.

| Purpose | Command |
|---|---|
| Build | `{{BUILD_CMD}}` |
| Test  | `{{TEST_CMD}}` |
| Lint  | `{{LINT_CMD}}` |
| Run   | `{{RUN_CMD}}` |

## Read first

At the start of a session, read `docs/ai/context/ARCHITECTURE.md` (and `BUSINESS.md` when the
task touches business rules). If they are still placeholders, suggest running `/index`.

## Rules

0. **Skills first.** Before acting, check whether a skill in `.claude/skills/` covers the task
   (`using-agent-skills` explains how). Use `find-skills` when unsure.
1. **Plan before non-trivial work.** More than 2 files, a new feature or unclear scope ->
   `/plan` or `/spec` and wait for approval.
2. **Reproduce before fixing.** Bugs go through `/fix`: failing test first, then root cause.
3. **Minimal code (ponytail).** YAGNI -> reuse existing code -> stdlib -> existing dependency ->
   new code. No new dependency without asking. Mode is shown in the status line; change it
   with `/ponytail off|lite|full|strict`.
4. **Code graph first.** If the `codegraph` MCP server is connected, use it to find symbols,
   callers and references before text search.
5. **Small, focused changes.** Match surrounding style. No drive-by refactors, no TODOs,
   commented-out code or debug logging left behind.
6. **Bounded loops.** Review/fix cycles stop after 3 rounds. If still failing, append the case
   to `docs/ai/report/harness-issues.md` and ask the human.
7. **Report honestly.** Say what you verified and how. Never claim green tests you did not run.

## Security non-negotiables

- Never commit secrets. Credentials live in `mcp/.env` (git-ignored) or the environment.
- Never print, log or paste tokens, passwords or personal data.
- Validate all external input; use parameterised queries; encode output.
- No destructive commands (`rm -rf`, `git push --force`, `git reset --hard`, `DROP TABLE`,
  `kubectl delete`). The `guard-bash` hook blocks them and any attempt to read, commit or push
  secrets. If it blocks you, explain the risk to the human - never try to work around it.
- Changes touching auth, payments, personal data or permissions need `/review` by
  `senior-reviewer` before merge.

## Agent team

See `AGENTS.md`. Agents live in `.claude/agents/`, commands in `.claude/commands/`,
skills in `.claude/skills/`, shared checklists in `.claude/references/`.

## Project notes

_Add project-specific conventions, domain terms and gotchas here. This section is yours;
on harness update a locally edited CLAUDE.md is kept and the new version is written to
`CLAUDE.md.harness-new` for you to merge._
