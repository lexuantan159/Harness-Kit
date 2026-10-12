#!/usr/bin/env node
// SessionStart hook: inject the using-agent-skills meta-skill and the state of the context docs.
'use strict';

const fs = require('fs');
const path = require('path');
const { projectDir } = require('./ponytail-config');
const { readInput, emitContext } = require('./ponytail-runtime');

const input = readInput();
const root = projectDir(input);
const parts = [];

// Flat in an installed project, grouped by category when loaded as a plugin.
const metaSkill = ['using-agent-skills', path.join('00-meta', 'using-agent-skills')]
  .map((d) => path.join(__dirname, '..', 'skills', d, 'SKILL.md'))
  .find((p) => fs.existsSync(p));
try {
  const body = fs.readFileSync(metaSkill, 'utf8').replace(/^---[\s\S]*?---\s*/, '');
  parts.push(body.trim());
} catch {
  // skill missing: nothing to inject
}

const contextDir = path.join(root, 'docs', 'ai', 'context');
const docs = ['ARCHITECTURE.md', 'SCHEMA.md', 'BUSINESS.md'];
const stale = docs.filter((d) => {
  try {
    return fs.readFileSync(path.join(contextDir, d), 'utf8').includes('<!-- harness:placeholder -->');
  } catch {
    return true;
  }
});
if (stale.length === docs.length) {
  parts.push('Context docs in docs/ai/context/ are not generated yet. Suggest running /index before larger tasks.');
} else {
  parts.push('Read docs/ai/context/ARCHITECTURE.md before working on code' +
    (stale.length ? ` (not generated yet: ${stale.join(', ')}).` : '.'));
}

emitContext('SessionStart', parts.join('\n\n'));
