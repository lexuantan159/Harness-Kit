#!/usr/bin/env node
// UserPromptSubmit hook: switch ponytail mode on "/ponytail <mode>" and re-inject the rules.
'use strict';

const { MODES } = require('./ponytail-config');
const { readInput, getMode, setMode, emitContext } = require('./ponytail-runtime');
const { instructionsFor } = require('./ponytail-instructions');

const input = readInput();
const match = /^\s*\/(?:[\w-]+:)?ponytail(?:\s+(\w+))?\s*$/i.exec(input.prompt || '');
if (match) {
  const requested = (match[1] || '').toLowerCase();
  if (MODES.includes(requested)) {
    setMode(input, requested);
    emitContext(
      'UserPromptSubmit',
      requested === 'off'
        ? 'PONYTAIL is now OFF. Ignore earlier ponytail rules for the rest of this session.'
        : `PONYTAIL mode changed to ${requested}. These rules replace earlier ponytail rules:\n${instructionsFor(requested)}`
    );
  } else {
    emitContext('UserPromptSubmit', `PONYTAIL mode is ${getMode(input)}. Valid modes: ${MODES.join(', ')}.`);
  }
}
