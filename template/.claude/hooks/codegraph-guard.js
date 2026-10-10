#!/usr/bin/env node
// PreToolUse(Grep) hook: when a codegraph index exists, steer symbol lookups to the codegraph MCP tools.
// Bypass for one session with HARNESS_ALLOW_GREP=1.
'use strict';

const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const path = require('path');
const { execFileSync } = require('child_process');
const { projectDir } = require('./ponytail-config');
const { readInput } = require('./ponytail-runtime');

const input = readInput();
if (process.env.HARNESS_ALLOW_GREP === '1') process.exit(0);
if (!fs.existsSync(path.join(projectDir(input), '.codegraph'))) process.exit(0);
try {
  execFileSync(process.platform === 'win32' ? 'where' : 'which', ['codegraph'], { stdio: 'ignore' });
} catch {
  process.exit(0);
}

// Block only code-symbol shapes (OrderService, getUser, order_id); plain words and text pass.
const pattern = (input.tool_input && input.tool_input.pattern) || '';
const symbol = /^[A-Za-z_]\w*$/.test(pattern) && (/[a-z][A-Z]/.test(pattern) || /[A-Za-z0-9]_[A-Za-z0-9]/.test(pattern));
if (!symbol) process.exit(0);

// A repeated identical search is the fallback after codegraph found nothing: let it through.
const last = path.join(os.tmpdir(), `harness-codegraph-guard-${crypto.createHash('sha1').update(projectDir(input)).digest('hex').slice(0, 12)}`);
let previous = '';
try { previous = fs.readFileSync(last, 'utf8'); } catch { /* first block */ }
if (previous === pattern) process.exit(0);
fs.writeFileSync(last, pattern);

process.stderr.write(
  `"${pattern}" looks like a symbol. Use the codegraph MCP tools (definitions, references, callers) first. ` +
  'If codegraph returns nothing, run the same Grep again and it will be allowed.'
);
process.exit(2);
