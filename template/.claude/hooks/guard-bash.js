#!/usr/bin/env node
// PreToolUse(Bash) hook: blocks destructive commands, reading/sending secret files, and committing
// or pushing secrets. Deny = blocked; ask = the user must confirm. Turn off with HARNESS_GUARD=off.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { projectDir } = require('./ponytail-config');
const { readInput } = require('./ponytail-runtime');
const R = require('./guard-rules');

const MAX_SCAN_BYTES = 1024 * 1024;

function git(cwd, args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * MAX_SCAN_BYTES, timeout: 10000, stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return '';
  }
}

const lines = (text) => text.split('\n').filter(Boolean);
const stripHeredocs = (cmd) => cmd.replace(/<<-?\s*['"]?(\w+)['"]?[^\n]*\n[\s\S]*?\n\s*\1\b/g, '<<HEREDOC');
const stripQuotes = (cmd) => cmd.replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, '""');
const splitCommands = (cmd) => cmd.split(/&&|\|\||;|\n/).map((s) => s.trim()).filter(Boolean);

// First real program of a pipeline stage, skipping env assignments and wrappers.
function program(stage) {
  const tokens = stage.trim().split(/\s+/);
  let i = 0;
  while (i < tokens.length && (/^\w+=/.test(tokens[i]) || /^(sudo|command|exec|nohup|time|xargs|env)$/.test(tokens[i]) || /^-/.test(tokens[i]))) i++;
  return path.basename(tokens[i] || '');
}

// Added lines of a unified diff -> findings. Secret values are never included.
function scanDiff(diff, findings) {
  let file = '';
  let line = 0;
  for (const l of diff.split('\n')) {
    if (l.startsWith('+++ ')) { file = l.replace(/^\+\+\+ (b\/)?/, ''); continue; }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)/.exec(l);
    if (hunk) { line = Number(hunk[1]); continue; }
    if (!l.startsWith('+') || l.startsWith('+++')) continue;
    scanLine(l.slice(1), `${file}:${line}`, findings);
    line++;
  }
}

function scanLine(text, where, findings) {
  if (text.includes(R.ALLOW_MARKER)) return;
  for (const [id, re] of R.SECRET_CONTENT) {
    if (re.test(text)) findings.deny.push(`${where} looks like a ${id}`);
  }
  const generic = R.GENERIC_SECRET.exec(text);
  if (generic && !R.PLACEHOLDER.test(generic[2])) findings.ask.push(`${where} hard-codes a ${generic[1]}`);
}

function scanFiles(cwd, files, findings) {
  for (const rel of files) {
    const full = path.join(cwd, rel);
    try {
      const stat = fs.statSync(full);
      if (!stat.isFile() || stat.size > MAX_SCAN_BYTES) continue;
      const buf = fs.readFileSync(full);
      if (buf.includes(0)) continue; // binary
      buf.toString('utf8').split('\n').forEach((text, i) => scanLine(text, `${rel}:${i + 1}`, findings));
    } catch {
      // unreadable: skip
    }
  }
}

function secretPaths(paths) {
  return paths.filter((p) => R.SECRET_PATH.test(p));
}

// Untracked (not ignored) + modified files a bulk `git add` would stage.
function stageable(cwd) {
  const untracked = lines(git(cwd, ['ls-files', '--others', '--exclude-standard']));
  const modified = lines(git(cwd, ['diff', '--name-only']));
  return { untracked, modified };
}

function checkGit(cwd, cmd, findings) {
  const adds = [...cmd.matchAll(/\bgit\s+(?:-\S+\s+)*add\b([^;&|\n]*)/g)].map((m) => m[1].trim().split(/\s+/).filter(Boolean));
  const bulkAdd = adds.some((args) => args.some((a) => ['.', '-A', '--all', '-u', '--update', ':/', '*'].includes(a)));
  const commit = /\bgit\s+(?:-\S+\s+)*commit\b/.test(cmd);
  const commitAll = commit && /\bgit\s+(?:-\S+\s+)*commit\b[^;&|\n]*\s(-[a-zA-Z]*a[a-zA-Z]*|--all)\b/.test(cmd);
  const push = /\bgit\s+(?:-\S+\s+)*push\b/.test(cmd);
  if (!adds.length && !commit && !push) return;

  const explicit = adds.flat().filter((a) => !a.startsWith('-'));
  const { untracked, modified } = bulkAdd || commitAll || commit ? stageable(cwd) : { untracked: [], modified: [] };

  // Files about to be staged/committed.
  const toStage = [...explicit];
  if (bulkAdd) toStage.push(...untracked, ...modified);
  else if (commitAll) toStage.push(...modified);
  const staged = commit ? lines(git(cwd, ['diff', '--cached', '--name-only', '--diff-filter=ACMR'])) : [];

  const badFiles = secretPaths([...toStage, ...staged]);
  if (badFiles.length) findings.deny.push(`would commit secret file(s): ${[...new Set(badFiles)].join(', ')} - add them to .gitignore instead`);

  if (commit || adds.length) {
    if (commit) scanDiff(git(cwd, ['diff', '--cached', '-U0', '--no-color', '--no-ext-diff']), findings);
    const trackedToStage = toStage.filter((f) => !untracked.includes(f));
    if (trackedToStage.length) scanDiff(git(cwd, ['diff', '-U0', '--no-color', '--no-ext-diff', '--', ...trackedToStage]), findings);
    const untrackedToStage = bulkAdd ? untracked : explicit.filter((f) => untracked.includes(f));
    scanFiles(cwd, untrackedToStage, findings);
  }

  if (push) {
    let base = git(cwd, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']).trim();
    if (!base) base = git(cwd, ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD']).trim();
    if (base) {
      const range = `${base}..HEAD`;
      const pushed = secretPaths(lines(git(cwd, ['diff', '--name-only', range])));
      if (pushed.length) findings.deny.push(`would push secret file(s): ${pushed.join(', ')}`);
      scanDiff(git(cwd, ['diff', '-U0', '--no-color', '--no-ext-diff', range]), findings);
    }
  }
}

function evaluate(command, cwd) {
  const findings = { deny: [], ask: [] };
  const raw = stripHeredocs(command);
  const bare = stripQuotes(raw);

  // `sh -c "..."` / eval hide the real command inside quotes: check the raw text too.
  const texts = /\b(ba|z)?sh\s+-c\b|\beval\b/.test(bare) ? [bare, raw.replace(/["']/g, ' ')] : [bare];
  for (const text of texts) {
    for (const segment of splitCommands(text)) {
      for (const [, test, reason] of R.DENY_COMMANDS) if (test(segment)) findings.deny.push(`${reason}: \`${segment}\``);
      for (const [, test, reason] of R.ASK_COMMANDS) if (test(segment)) findings.ask.push(`${reason}: \`${segment}\``);
    }
  }
  if (R.SQL_CLIENT.test(command)) {
    for (const [, test, reason] of R.SQL_RULES) if (test(command)) findings.deny.push(reason);
  }

  // Secret files: reading/copying/sending them is blocked; other references need confirmation.
  for (const segment of splitCommands(bare)) {
    for (const stage of segment.split('|')) {
      if (!R.SECRET_FILE.test(stage)) continue;
      const prog = program(stage);
      if (R.READERS.test(prog) || (prog === 'git' && /\badd\b/.test(stage))) {
        findings.deny.push(`reads or sends a secret file: \`${stage.trim()}\``);
      } else {
        findings.ask.push(`touches a secret file: \`${stage.trim()}\``);
      }
    }
  }

  checkGit(cwd, raw, findings);
  return findings;
}

function respond(decision, reasons) {
  const unique = [...new Set(reasons)];
  const advice = decision === 'deny'
    ? 'Blocked by the harness guard. Do not try to work around it; explain the risk to the user and let them run it themselves if they really want it.'
    : 'Flagged by the harness guard - confirm only if this is intended.';
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decision,
      permissionDecisionReason: `${advice}\n- ${unique.join('\n- ')}`,
    },
  }));
}

if (require.main === module) {
  if (process.env.HARNESS_GUARD === 'off') process.exit(0);
  const input = readInput();
  const command = (input.tool_input && input.tool_input.command) || '';
  if (!command) process.exit(0);
  const findings = evaluate(command, (input.cwd && fs.existsSync(input.cwd) ? input.cwd : projectDir(input)));
  if (findings.deny.length) respond('deny', findings.deny);
  else if (findings.ask.length) respond('ask', findings.ask);
}

module.exports = { evaluate };
