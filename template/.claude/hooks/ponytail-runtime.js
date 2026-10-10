// Ponytail runtime: read hook input, read/write the active mode, emit hook output.
'use strict';

const fs = require('fs');
const path = require('path');
const { MODES, DEFAULT_MODE, stateFile } = require('./ponytail-config');

function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getMode(input) {
  try {
    const mode = fs.readFileSync(stateFile(input), 'utf8').trim();
    return MODES.includes(mode) ? mode : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

function setMode(input, mode) {
  const file = stateFile(input);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, mode + '\n');
}

function emitContext(hookEventName, additionalContext) {
  if (!additionalContext) return;
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext } }));
}

module.exports = { readInput, getMode, setMode, emitContext };
