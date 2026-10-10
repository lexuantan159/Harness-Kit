#!/usr/bin/env node
// SessionStart hook: inject the ponytail rules for the active mode.
'use strict';

const { readInput, getMode, emitContext } = require('./ponytail-runtime');
const { instructionsFor } = require('./ponytail-instructions');

const input = readInput();
const mode = getMode(input);
emitContext('SessionStart', mode === 'off' ? '' : `${instructionsFor(mode)}\n(Change with /ponytail off|lite|full|strict.)`);
