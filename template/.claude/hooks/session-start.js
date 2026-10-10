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

const metaSkill = path.join(__dirname, '..', 'skills', 'using-agent-skills', 'SKILL.md');
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
