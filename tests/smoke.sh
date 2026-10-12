#!/usr/bin/env sh
# Smoke test: install the harness into a temp project and exercise update, hooks and uninstall.
set -eu
KIT="$(cd "$(dirname "$0")/.." && pwd)"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
fail() { echo "FAIL: $*" >&2; exit 1; }
ok() { echo "ok   $*"; }
command -v jq >/dev/null && command -v git >/dev/null || fail "smoke test needs jq and git"

cd "$T" && git init -q && cd - >/dev/null
printf '{"type":"module"}\n' > "$T/package.json"   # hooks must still run in ESM projects
printf 'my own rules\n' > "$T/CLAUDE.md"

"$KIT/install.sh" "$T" --dry-run >/dev/null
[ ! -e "$T/AGENTS.md" ] && [ ! -e "$T/.harness-manifest.json" ] || fail "--dry-run wrote files"
ok "dry-run writes nothing"

"$KIT/install.sh" "$T" --set project.name=demo --set commands.test="npm test" --set stacks=java,node \
  --set models.strong=claude-sonnet-5-5 --set models.default=claude-haiku-5-5 >/dev/null
[ "$(cat "$T/CLAUDE.md")" = "my own rules" ] || fail "pre-existing CLAUDE.md overwritten"
[ -f "$T/CLAUDE.md.harness-new" ] || fail "no .harness-new for pre-existing CLAUDE.md"
grep -q '^model: claude-sonnet-5-5$' "$T/.claude/agents/reviewer.md" || fail "strong tier mapped wrong"
grep -q '^model: claude-haiku-5-5$' "$T/.claude/agents/coder.md" || fail "default tier mapped wrong"
grep -q '^model: claude-haiku-5-5$' "$T/.claude/agents/tester.md" || fail "fast tier changed"
for f in CLAUDE.md AGENTS.md .mcp.json .harness-version .harness-manifest.json .harness-config.json \
         .claude/settings.json .claude/agents/coder.md .claude/commands/plan.md \
         .claude/skills/ponytail/SKILL.md .claude/skills/java-development/SKILL.md \
         .claude/hooks/session-start.js .github/copilot-instructions.md mcp/.env docs/ai/context/ARCHITECTURE.md; do
  [ -f "$T/$f" ] || fail "missing $f"
done
[ ! -e "$T/.claude/.claude-plugin" ] && [ ! -e "$T/.claude/hooks/hooks.json" ] || fail "plugin-only files installed"
[ ! -e "$T/.claude/skills/python-development" ] || fail "unselected stack installed"
[ -z "$(find "$T/.claude/skills" -mindepth 1 -maxdepth 1 -name '[0-9][0-9]-*')" ] || fail "skill category folder not flattened"
ok "install creates expected files"

grep -rn '{{[A-Z_]*}}' "$T" --exclude-dir=.git && fail "unrendered placeholders"
grep -q 'npm test' "$T/CLAUDE.md.harness-new" || fail "config not rendered"
ok "placeholders rendered"

for f in .mcp.json .claude/settings.json .harness-manifest.json; do jq . "$T/$f" >/dev/null || fail "invalid JSON $f"; done
grep -q 'mcp/.env' "$T/.gitignore" || fail ".gitignore not updated"
ok "JSON valid, .gitignore updated"

out=$("$KIT/install.sh" update "$T")
echo "$out" | grep -q 'up to date' || fail "second update not idempotent: $out"
ok "update is idempotent"

rm "$T/CLAUDE.md.harness-new"
echo "# local note" >> "$T/AGENTS.md"
echo "custom" > "$T/docs/ai/context/ARCHITECTURE.md"
rm "$T/docs/ai/context/SCHEMA.md"
"$KIT/install.sh" update "$T" --set project.name=renamed --set stacks=java >/dev/null
grep -q 'local note' "$T/AGENTS.md" || fail "local AGENTS.md overwritten"
grep -q 'renamed' "$T/AGENTS.md.harness-new" || fail "no .harness-new for modified file"
grep -q 'renamed' "$T/.github/copilot-instructions.md" || fail "pristine file not updated"
[ "$(cat "$T/docs/ai/context/ARCHITECTURE.md")" = custom ] || fail "seed file overwritten"
[ ! -e "$T/docs/ai/context/SCHEMA.md" ] || fail "deleted seed file recreated"
[ ! -e "$T/.claude/skills/node-development" ] || fail "removed stack left behind (or its empty dir)"
ok "update keeps local edits and seed files, removes dropped stack"

grep -q renamed "$T/CLAUDE.md.harness-new" || fail "changed kit version not offered for pre-existing file"
rm "$T/AGENTS.md.harness-new" "$T/CLAUDE.md.harness-new"
out=$("$KIT/install.sh" update "$T")
echo "$out" | grep -q 'up to date' || fail "conflict offered again for unchanged kit: $out"
[ ! -e "$T/AGENTS.md.harness-new" ] && [ ! -e "$T/CLAUDE.md.harness-new" ] || fail ".harness-new recreated"
ok "an offered kit version is not offered again"

cp "$T/.github/copilot-instructions.md" "$T/ci.tmp" && sed 's/$/\r/' "$T/ci.tmp" > "$T/.github/copilot-instructions.md" && rm "$T/ci.tmp"
"$KIT/install.sh" status "$T" | grep -q 'modified   .github/copilot-instructions.md' && fail "CRLF checkout seen as modified"
ok "CRLF line endings are not a modification"

export CLAUDE_PROJECT_DIR="$T"
echo '{}' | node "$T/.claude/hooks/session-start.js" | jq -e '.hookSpecificOutput.additionalContext | contains("Using agent skills")' >/dev/null || fail "session-start"
echo '{}' | node "$T/.claude/hooks/ponytail-activate.js" | jq -e '.hookSpecificOutput.additionalContext | contains("PONYTAIL (full)")' >/dev/null || fail "ponytail-activate"
echo '{"prompt":"/ponytail strict"}' | node "$T/.claude/hooks/ponytail-mode-tracker.js" | grep -q 'strict' || fail "mode tracker"
[ "$(cat "$T/.claude/.ponytail-active")" = strict ] || fail "mode not persisted"
echo '{"prompt":"hello"}' | node "$T/.claude/hooks/ponytail-mode-tracker.js" | grep -q . && fail "tracker fired on normal prompt"
echo '{"model":{"display_name":"Opus"}}' | node "$T/.claude/hooks/ponytail-statusline.js" | grep -q '^ponytail:strict | Opus' || fail "statusline"
echo '{"tool_input":{"pattern":"OrderService"}}' | node "$T/.claude/hooks/codegraph-guard.js" || fail "codegraph guard blocked without index"
mkdir -p "$T/.codegraph" "$T/fakebin" && printf '#!/bin/sh\n' > "$T/fakebin/codegraph" && chmod +x "$T/fakebin/codegraph"
g() { echo "{\"tool_input\":{\"pattern\":\"$1\"}}" | PATH="$T/fakebin:$PATH" node "$T/.claude/hooks/codegraph-guard.js" 2>/dev/null; }
g password || fail "guard blocked plain word"
g OrderService && fail "guard did not block symbol"
g OrderService || fail "guard blocked the repeated fallback search"
rm -rf "$T/.codegraph" "$T/fakebin"
echo '{"tool_input":{"command":"cat mcp/.env"}}' | node "$T/.claude/hooks/guard-bash.js" | jq -e '.hookSpecificOutput.permissionDecision == "deny"' >/dev/null || fail "guard-bash did not deny"
echo '{"tool_input":{"command":"git status"}}' | node "$T/.claude/hooks/guard-bash.js" | grep -q . && fail "guard-bash flagged a safe command"
jq -e '.hooks.PreToolUse[] | select(.matcher == "Bash")' "$T/.claude/settings.json" >/dev/null || fail "guard-bash not wired in settings.json"
(cd "$T" && node .claude/scripts/dashboard.js) | grep -q dashboard.html || fail "dashboard"
unset CLAUDE_PROJECT_DIR
ok "hooks and dashboard run"

"$KIT/install.sh" uninstall "$T" --force >/dev/null
[ "$(cat "$T/CLAUDE.md")" = "my own rules" ] || fail "uninstall --force touched pre-existing file"
[ ! -e "$T/AGENTS.md" ] || fail "uninstall --force left modified file"
[ ! -e "$T/.claude/agents" ] || fail "uninstall left empty directories"
ok "uninstall --force removes harness files, never pre-existing ones"

"$KIT/install.sh" "$T" --set stacks=.. >/dev/null 2>&1 && fail "path traversal in stacks accepted"
"$KIT/install.sh" "$T" --config "$T/nope.json" >/dev/null 2>&1 && fail "missing --config accepted"
ok "bad input rejected"

[ "$(jq -r .version "$KIT/template/.claude/.claude-plugin/plugin.json")" = "$(cat "$KIT/VERSION")" ] || fail "plugin.json version != VERSION"
ok "plugin version matches VERSION"

grep -rniE 'GEUNEXL|sony|\bL05\b' "$KIT/template" "$KIT/stacks" && fail "project-specific strings in kit"
ok "kit is project-agnostic"

node --test "$KIT/tests/guard.test.js" >/dev/null 2>&1 || fail "guard unit tests (run: node --test tests/guard.test.js)"
ok "guard unit tests"

echo "all smoke tests passed"
