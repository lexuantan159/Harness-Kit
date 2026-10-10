// Ponytail configuration: modes and where the active mode is stored.
'use strict';

const path = require('path');

const MODES = ['off', 'lite', 'full', 'strict'];
const DEFAULT_MODE = MODES.includes(process.env.PONYTAIL_DEFAULT_MODE) ? process.env.PONYTAIL_DEFAULT_MODE : 'full';

function projectDir(input) {
  return process.env.CLAUDE_PROJECT_DIR || (input && input.cwd) || process.cwd();
}

function stateFile(input) {
  return path.join(projectDir(input), '.claude', '.ponytail-active');
}

module.exports = { MODES, DEFAULT_MODE, projectDir, stateFile };
