#!/usr/bin/env node
// Status line: ponytail mode | model | git branch.
'use strict';

const fs = require('fs');
const path = require('path');
const { projectDir } = require('./ponytail-config');
const { readInput, getMode } = require('./ponytail-runtime');

const input = readInput();
const parts = [`ponytail:${getMode(input)}`];
if (input.model && input.model.display_name) parts.push(input.model.display_name);
try {
  const head = fs.readFileSync(path.join(projectDir(input), '.git', 'HEAD'), 'utf8').trim();
  parts.push(head.startsWith('ref: refs/heads/') ? head.slice(16) : head.slice(0, 7));
} catch {
  // not a git checkout, or a worktree: skip the branch
}
process.stdout.write(parts.join(' | '));
