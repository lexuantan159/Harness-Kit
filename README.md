# Harness-Kit

A reusable AI-agent harness for Claude Code and GitHub Copilot. Install it into any repository to
get an agent team, workflow commands, lifecycle skills, safety permissions and the *ponytail*
minimal-code hooks. Update it later without losing local edits.

## What gets installed

```
<your-project>/
  CLAUDE.md                     rules for Claude Code (rendered from your config)
  AGENTS.md                     rules for any agent + agent team table
  .mcp.json                     only the MCP servers you enabled
  .harness-version              kit version
  .harness-manifest.json        managed files + hashes (drives safe updates)
  .harness-config.json          the config used for this project
  .claude/
    settings.json               permissions (allow/deny) + hooks + status line
    agents/                     planner, coder, tester, reviewer, senior-reviewer,
                                researcher, documenter, biz-analyst, pr-review
    commands/                   /index /plan /spec /code /fix /review /pr-review
                                /assess /deploy /dashboard /ponytail
    skills/                     45 skills by lifecycle (+ selected stack packs)
    hooks/                      guard-bash (safety), session-start, ponytail-*, codegraph-guard (Node)
    references/                 security, testing, performance, accessibility, orchestration
    scripts/dashboard.js        builds docs/ai/dashboard.html
  .github/                      Copilot: copilot-instructions.md, prompts/, instructions/
  mcp/                          teams_server.py, requirements.txt, .env.example -> .env
  docs/ai/                      context/ (project-owned), reviews/, sessions/, report/
```

## Requirements

- Node.js >= 18 (installer and hooks)
- Optional: Python >= 3.10 for the Teams MCP server (`pip install -r mcp/requirements.txt`),
  `npx` for the sequential-thinking MCP server, `codegraph`, `ast-grep` (`sg`), `gh`.

## Install

```sh
git clone <this-repo> ~/harness-kit
cp ~/harness-kit/harness.config.example.json ./harness.config.json   # edit it
~/harness-kit/install.sh /path/to/project --config ./harness.config.json
```

Windows: `~\harness-kit\install.ps1 C:\path\to\project --config .\harness.config.json`

Without a config file the defaults are used (project name = folder name). Override single values
with `--set`, for example `--set project.stack="Java 17, Spring Boot" --set stacks=java`.
Add `--dry-run` to preview any command.

Then, in the project:
1. Fill in tokens in `mcp/.env` (git-ignored) for what you use.
2. Open Claude Code and run `/index` to generate `docs/ai/context/*`.
3. Commit the harness files.

## Configuration (`harness.config.json`)

| Key | Meaning |
|---|---|
| `project.name / description / stack / defaultBranch` | Rendered into CLAUDE.md, AGENTS.md, Copilot instructions |
| `commands.build / test / lint / run` | The verify commands agents must run |
| `stacks` | Stack packs from `stacks/` to add: `java`, `node`, `python` |
| `models.strong / default / fast` | Model ids for agents (defaults: `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5`) |
| `mcp.teams / sequentialThinking / codegraph` | Which MCP servers go into `.mcp.json` |
| `python` | Python executable for the Teams server (`python3` / `python`) |
| `copilot` | `false` skips the `.github/` files |

Only enabled MCP servers are written to `.mcp.json`, so missing tools no longer show up as
`CONNECTION_CLOSED`.

## Update

```sh
cd ~/harness-kit && git pull
./install.sh update /path/to/project            # reuses .harness-config.json
./install.sh status /path/to/project            # what is modified / pending
```

- Files you have not touched are replaced.
- Files you edited are kept; the new version is written as `<file>.harness-new` to merge by hand.
- Files removed from the kit are deleted only if unmodified.
- `docs/ai/context/*` and `mcp/.env` are project-owned and never overwritten.
- Files that existed before the first install (e.g. your own CLAUDE.md) are never overwritten or
  removed, even with `--force`; the kit version is offered as `.harness-new` instead.
- A kit version is offered once: after you merge and delete the `.harness-new` file, it is not
  recreated until the kit changes that file again.
- `--force` overwrites everything managed except pre-existing files (your edits are lost).

`./install.sh uninstall /path/to/project` removes unmodified managed files.

## Use as a Claude Code plugin

The `.claude/` part (agents, commands, skills, hooks) is also packaged as a plugin. This repo is
a plugin marketplace:

```
/plugin marketplace add <git-url-or-path-of-this-repo>
/plugin install harness-kit@harness-kit
```

The plugin gives you the agents, commands, skills and hooks in every project, but not the
per-project files (CLAUDE.md, AGENTS.md, settings permissions, Copilot files, MCP, docs/ai).
Use the installer for those. Don't use both for the same project, or commands and skills appear twice.
In plugin mode `/dashboard` needs the installer's `.claude/scripts/dashboard.js`.
Plugins don't apply `settings.json` permissions or the status line, so plugin-only users get
neither the deny list nor the ponytail status line.

## Safety guard (`guard-bash.js`)

A `PreToolUse` hook on every Bash command, independent of the permission lists:

| Decision | What |
|---|---|
| **deny** | `rm -rf` (any flag order), force push / `+ref`, `reset --hard`, `clean -f`, `branch -D`, destructive SQL through a SQL client (`DROP`, `TRUNCATE`, `DELETE` without `WHERE`), `kubectl delete`, `terraform destroy`, `docker ... prune`, disk wipes, `chmod -R 777`, `curl ... \| sh` |
| **deny** | Reading, copying or sending secret files (`.env*` except `.example/.sample/.template`, `*.pem`, `*.key`, `id_rsa`, `.npmrc`, `credentials.json`, ...) |
| **deny** | `git add` / `commit` / `push` that would include a secret file, or added lines containing a private key, AWS/GitHub/GitLab/Slack/Google/Stripe/OpenAI/Anthropic key, JWT or Teams webhook URL |
| **ask** | `sudo`, `git push`, `npm publish` / `docker push` / `mvn deploy`, `terraform apply`, `find -delete`, hard-coded `password = "..."`-style values, other commands touching secret files |

Quoted text and heredocs (commit messages) are ignored, so `git commit -m "remove rm -rf"` passes.
Secret values are never echoed in the reason. Mark a known-safe line (test fixture) with
`harness-allow-secret`. Turn the guard off for a session by starting Claude Code with
`HARNESS_GUARD=off`. Tests: `node --test tests/guard.test.js`.

The guard only sees commands run by the agent. Humans committing by hand are not covered; use a
git pre-commit secret scanner (gitleaks, detect-secrets) for that.

## Permissions

`.claude/settings.json` allows common read-only git/docker/gh commands and denies destructive ones
(`rm -rf`, force push, `reset --hard`, `DROP TABLE`, `kubectl delete`, reading `mcp/.env`).
Treat the deny list as a safety net, not a sandbox: shell commands can be phrased in ways a
pattern doesn't catch.

## Ponytail

Minimal-code rules injected at session start: YAGNI -> reuse -> stdlib -> existing dependency ->
new code. Switch with `/ponytail off|lite|full|strict` (stored in `.claude/.ponytail-active`,
shown in the status line). Default mode: `full`, or set env `PONYTAIL_DEFAULT_MODE`.

## Codegraph guard

When a `.codegraph/` index exists and `codegraph` is on PATH, Grep calls for symbol-like
patterns are blocked in favour of the codegraph MCP tools. Plain-text searches are allowed.
Repeating the same Grep lets it through (the fallback when codegraph finds nothing).
Set `HARNESS_ALLOW_GREP=1` to turn the guard off.

## Developing the kit

```
bin/harness.js          installer (no dependencies)
install.sh/.ps1         wrappers
template/               files installed into projects ({{PLACEHOLDERS}} rendered)
template/.claude/       also the plugin root (.claude-plugin/plugin.json, hooks/hooks.json)
stacks/<name>/          optional stack packs
tests/smoke.sh          end-to-end test: install, update, hooks, uninstall
tests/guard.test.js     unit tests for the Bash safety guard
```

Run `./tests/smoke.sh` before tagging a release. Bump `VERSION` and
`template/.claude/.claude-plugin/plugin.json` together.
