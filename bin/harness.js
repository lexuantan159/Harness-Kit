#!/usr/bin/env node
// Harness kit installer: install | update | uninstall | status.
// Zero dependencies. Node >= 18.
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KIT_ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(KIT_ROOT, 'template');
const VERSION = fs.readFileSync(path.join(KIT_ROOT, 'VERSION'), 'utf8').trim();

const MANIFEST = '.harness-manifest.json';
const VERSION_FILE = '.harness-version';
const CONFIG_FILE = '.harness-config.json';
const NEW_SUFFIX = '.harness-new';

// Files the kit ships for plugin packaging only; never copied into a project.
const PLUGIN_ONLY = ['.claude/.claude-plugin/', '.claude/hooks/hooks.json'];
// Written once, then owned by the project. Never overwritten or removed.
const SEED_FILES = [/^docs\/ai\/context\//, /^docs\/ai\/(reviews|sessions|report)\/\.gitkeep$/];
const COPILOT_FILES = /^\.github\//;
const GITIGNORE_LINES = [
  'mcp/.env',
  '.claude/settings.local.json',
  '.claude/.ponytail-active',
  `*${NEW_SUFFIX}`,
  'docs/ai/dashboard.html',
];
const DEFAULT_MODELS = { strong: 'claude-opus-5-5', default: 'claude-sonnet-5-5', fast: 'claude-haiku-5-5' };

function defaultConfig(target) {
  return {
    project: { name: path.basename(target), description: '', stack: '', defaultBranch: 'main' },
    commands: { build: '', test: '', lint: '', run: '' },
    stacks: [],
    models: { ...DEFAULT_MODELS },
    mcp: { teams: false, sequentialThinking: true, codegraph: false },
    python: process.platform === 'win32' ? 'python' : 'python3',
    copilot: true,
  };
}

function deepMerge(base, over) {
  const out = { ...base };
  for (const [k, v] of Object.entries(over || {})) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? deepMerge(base[k] || {}, v) : v;
  }
  return out;
}

function setPath(obj, dotted, raw) {
  const keys = dotted.split('.');
  let cur = obj;
  for (const k of keys.slice(0, -1)) cur = cur[k] = cur[k] && typeof cur[k] === 'object' ? cur[k] : {};
  let val = raw;
  if (raw === 'true' || raw === 'false') val = raw === 'true';
  else if (dotted === 'stacks') val = raw.split(',').map((s) => s.trim()).filter(Boolean);
  cur[keys[keys.length - 1]] = val;
}

function readJson(file, required = false) {
  if (!fs.existsSync(file)) {
    if (required) throw new Error(`Config file not found: ${file}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`Invalid JSON in ${file}: ${e.message}`);
  }
}

const TEXT_FILE = /\.(md|json|js|sh|ps1|py|ya?ml|txt|example|gitkeep)$/;
// Hash text files with normalised line endings so autocrlf checkouts don't look "modified".
function sha256(rel, buf) {
  const data = TEXT_FILE.test(rel) ? buf.toString('utf8').replace(/\r\n/g, '\n') : buf;
  return crypto.createHash('sha256').update(data).digest('hex');
}
const hashFile = (full, rel) => sha256(rel, fs.readFileSync(full));
const toPosix = (p) => p.split(path.sep).join('/');

function walk(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, base, out);
    else if (e.name !== '.DS_Store') out.push(toPosix(path.relative(base, full)));
  }
  return out;
}

function placeholders(cfg) {
  const orNone = (v) => v || '_not configured - set it in .harness-config.json and run update_';
  return {
    PROJECT_NAME: cfg.project.name,
    PROJECT_DESCRIPTION: cfg.project.description || '_Describe the project in one or two sentences._',
    STACK: cfg.project.stack || '_not specified_',
    DEFAULT_BRANCH: cfg.project.defaultBranch,
    BUILD_CMD: orNone(cfg.commands.build),
    TEST_CMD: orNone(cfg.commands.test),
    LINT_CMD: orNone(cfg.commands.lint),
    RUN_CMD: orNone(cfg.commands.run),
    HARNESS_VERSION: VERSION,
  };
}

function render(rel, buf, cfg) {
  if (!TEXT_FILE.test(rel)) return buf;
  let text = buf.toString('utf8').replace(/\r\n/g, '\n');
  const vars = placeholders(cfg);
  text = text.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
  if (rel.startsWith('.claude/agents/')) {
    // Single pass so a remapped tier is never remapped again by the next tier.
    text = text.replace(/^model: (\S+)$/m, (m, id) => {
      const tier = Object.keys(DEFAULT_MODELS).find((t) => DEFAULT_MODELS[t] === id);
      return tier && cfg.models[tier] ? `model: ${cfg.models[tier]}` : m;
    });
  }
  return Buffer.from(text, 'utf8');
}

function mcpJson(cfg) {
  const servers = {};
  if (cfg.mcp.teams) servers.teams = { command: cfg.python, args: ['mcp/teams_server.py'] };
  if (cfg.mcp.sequentialThinking) {
    servers['sequential-thinking'] = { command: 'npx', args: ['-y', '@modelcontextprotocol/server-sequential-thinking'] };
  }
  if (cfg.mcp.codegraph) servers.codegraph = { command: 'codegraph', args: ['serve', '--mcp'] };
  return Buffer.from(JSON.stringify({ mcpServers: servers }, null, 2) + '\n');
}

// Desired file set: relative path -> content buffer.
function plan(cfg) {
  const files = new Map();
  for (const rel of walk(TEMPLATE)) {
    if (PLUGIN_ONLY.some((p) => rel === p || rel.startsWith(p))) continue;
    if (!cfg.copilot && COPILOT_FILES.test(rel)) continue;
    files.set(rel, render(rel, fs.readFileSync(path.join(TEMPLATE, rel)), cfg));
  }
  const available = fs.readdirSync(path.join(KIT_ROOT, 'stacks'));
  const stacks = typeof cfg.stacks === 'string' ? cfg.stacks.split(',').map((s) => s.trim()).filter(Boolean) : cfg.stacks;
  for (const stack of stacks) {
    if (!available.includes(stack)) throw new Error(`Unknown stack "${stack}". Available: ${available.join(', ')}`);
    const dir = path.join(KIT_ROOT, 'stacks', stack);
    for (const rel of walk(dir)) files.set(rel, render(rel, fs.readFileSync(path.join(dir, rel)), cfg));
  }
  files.set('.mcp.json', mcpJson(cfg));
  files.set(VERSION_FILE, Buffer.from(VERSION + '\n'));
  return files;
}

function ensureGitignore(target, dry, log) {
  const file = path.join(target, '.gitignore');
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const have = new Set(current.split(/\r?\n/).map((l) => l.trim()));
  const missing = GITIGNORE_LINES.filter((l) => !have.has(l));
  if (!missing.length) return;
  log.push(`gitignore  +${missing.length} line(s)`);
  if (dry) return;
  const sep = current && !current.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(file, `${current}${sep}\n# harness kit\n${missing.join('\n')}\n`);
}

// Resolve a manifest/plan path inside target; refuse anything that escapes it.
function inside(target, rel) {
  const full = path.resolve(target, rel);
  const back = path.relative(target, full);
  if (!back || back.startsWith('..') || path.isAbsolute(back)) throw new Error(`Refusing path outside target: ${rel}`);
  return full;
}

function remove(target, rel) {
  let dir = path.dirname(inside(target, rel));
  fs.rmSync(inside(target, rel));
  // Drop directories the removal left empty, up to the target root.
  while (dir !== target && dir.startsWith(target) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

function write(target, rel, buf) {
  const full = inside(target, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, buf);
  if (/\.(sh|js)$/.test(rel) && rel.includes('/hooks/')) fs.chmodSync(full, 0o755);
}

function install(target, cfg, { dry, force }) {
  const old = readJson(path.join(target, MANIFEST)) || {};
  const oldFiles = old.files || {};
  const oldPre = new Set(old.preexisting || []);
  const oldSeeded = new Set(old.seeded || []);
  const files = plan(cfg);
  // files: path -> hash of the kit version last delivered (merged or not).
  // preexisting: files the project had before the harness; never overwritten or removed, even with --force.
  // seeded: project-owned files created once; not recreated if the project deletes them.
  const next = { kit: 'harness-kit', version: VERSION, updatedAt: new Date().toISOString(), files: {}, preexisting: [], seeded: [] };
  const log = [];
  const conflicts = [];

  for (const [rel, buf] of files) {
    const full = inside(target, rel);
    const newHash = sha256(rel, buf);
    const exists = fs.existsSync(full);

    if (SEED_FILES.some((re) => re.test(rel))) {
      next.seeded.push(rel);
      if (!exists && !oldSeeded.has(rel)) { log.push(`create     ${rel}`); if (!dry) write(target, rel, buf); }
      continue;
    }
    next.files[rel] = newHash;
    const curHash = exists ? hashFile(full, rel) : null;
    if (curHash === newHash) {
      if (fs.existsSync(full + NEW_SUFFIX)) { log.push(`clean      ${rel}${NEW_SUFFIX}  (merged)`); if (!dry) fs.rmSync(full + NEW_SUFFIX); }
      continue;
    }
    const preexisting = exists && (oldPre.has(rel) || !(rel in oldFiles));
    if (!exists || (!preexisting && (curHash === oldFiles[rel] || force))) {
      log.push(`${exists ? 'update ' : 'create '}    ${rel}`);
      if (!dry) write(target, rel, buf);
      continue;
    }
    // Locally modified: keep the project's file and offer the kit version next to it,
    // unless the kit version is the one already offered last time.
    if (preexisting) next.preexisting.push(rel);
    if (newHash === oldFiles[rel]) continue;
    conflicts.push(rel);
    log.push(`keep       ${rel}  (${preexisting ? 'existed before harness' : 'modified locally'}, kit version -> ${rel}${NEW_SUFFIX})`);
    if (!dry) write(target, rel + NEW_SUFFIX, buf);
  }

  for (const rel of Object.keys(oldFiles)) {
    if (rel in next.files) continue;
    const full = inside(target, rel);
    if (!fs.existsSync(full)) continue;
    if (!oldPre.has(rel) && (hashFile(full, rel) === oldFiles[rel] || force)) {
      log.push(`remove     ${rel}  (no longer in kit)`);
      if (!dry) remove(target, rel);
    } else {
      log.push(`orphan     ${rel}  (no longer in kit, but modified locally - left in place)`);
    }
  }

  ensureGitignore(target, dry, log);
  const env = path.join(target, 'mcp', '.env');
  if (!fs.existsSync(env) && !oldSeeded.has('mcp/.env') && files.has('mcp/.env.example')) {
    log.push('create     mcp/.env  (from .env.example - fill in your tokens)');
    if (!dry) write(target, 'mcp/.env', files.get('mcp/.env.example'));
  }
  next.seeded.push('mcp/.env');
  if (!dry) {
    fs.writeFileSync(path.join(target, CONFIG_FILE), JSON.stringify(cfg, null, 2) + '\n');
    fs.writeFileSync(path.join(target, MANIFEST), JSON.stringify(next, null, 2) + '\n');
  }
  return { log, conflicts };
}

function uninstall(target, { dry, force }) {
  const old = readJson(path.join(target, MANIFEST));
  if (!old) throw new Error(`No ${MANIFEST} in ${target} - nothing to uninstall.`);
  const pre = new Set(old.preexisting || []);
  const log = [];
  for (const [rel, hash] of Object.entries(old.files)) {
    const full = inside(target, rel);
    if (fs.existsSync(full + NEW_SUFFIX)) { log.push(`remove     ${rel}${NEW_SUFFIX}`); if (!dry) remove(target, rel + NEW_SUFFIX); }
    if (!fs.existsSync(full)) continue;
    if (pre.has(rel)) log.push(`keep       ${rel}  (existed before harness)`);
    else if (hashFile(full, rel) === hash || force) {
      log.push(`remove     ${rel}`);
      if (!dry) remove(target, rel);
    } else log.push(`keep       ${rel}  (modified locally)`);
  }
  if (!dry) for (const f of [MANIFEST, CONFIG_FILE]) fs.rmSync(path.join(target, f), { force: true });
  log.push('note       docs/ai/context, mcp/.env and .gitignore entries are left untouched');
  return { log, conflicts: [] };
}

function status(target) {
  const old = readJson(path.join(target, MANIFEST));
  if (!old) return { log: ['not installed'], conflicts: [] };
  const pre = new Set(old.preexisting || []);
  const log = [`installed ${old.version}, kit ${VERSION}`];
  for (const [rel, hash] of Object.entries(old.files)) {
    const full = inside(target, rel);
    if (!fs.existsSync(full)) log.push(`missing    ${rel}`);
    else if (pre.has(rel)) log.push(`project    ${rel}  (existed before harness)`);
    else if (hashFile(full, rel) !== hash) log.push(`modified   ${rel}`);
    if (fs.existsSync(full + NEW_SUFFIX)) log.push(`pending    ${rel}${NEW_SUFFIX}`);
  }
  return { log, conflicts: [] };
}

const USAGE = `Usage: harness <install|update|uninstall|status> <target-dir> [options]

Options:
  --config <file>     JSON config (see harness.config.example.json)
  --set key=value     Override one config value, e.g. --set project.name=Shop --set stacks=java,node
  --dry-run           Show what would change, write nothing
  --force             Overwrite / remove files even if modified locally
  -h, --help          Show this help

update reuses the target's .harness-config.json; --config/--set still override it.`;

function main(argv) {
  const args = { sets: [] };
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = () => {
      if (i + 1 >= argv.length) throw new Error(`${a} needs a value\n\n${USAGE}`);
      return argv[++i];
    };
    if (a === '--config') args.config = value();
    else if (a === '--set') args.sets.push(value());
    else if (a === '--dry-run') args.dry = true;
    else if (a === '--force') args.force = true;
    else if (a === '-h' || a === '--help') return console.log(USAGE);
    else if (a.startsWith('-')) throw new Error(`Unknown option ${a}\n\n${USAGE}`);
    else pos.push(a);
  }
  const [cmd, dir] = pos;
  if (!cmd || !dir || !['install', 'update', 'uninstall', 'status'].includes(cmd)) throw new Error(USAGE);
  const target = path.resolve(dir);
  if (!fs.existsSync(target)) throw new Error(`Target ${target} does not exist.`);

  let result;
  if (cmd === 'uninstall') result = uninstall(target, args);
  else if (cmd === 'status') result = status(target);
  else {
    let cfg = deepMerge(defaultConfig(target), readJson(path.join(target, CONFIG_FILE)));
    if (cmd === 'update' && !fs.existsSync(path.join(target, MANIFEST))) throw new Error(`No harness in ${target}. Run install first.`);
    if (args.config) cfg = deepMerge(cfg, readJson(path.resolve(args.config), true));
    for (const s of args.sets) {
      const eq = s.indexOf('=');
      if (eq < 1) throw new Error(`Bad --set "${s}", expected key=value`);
      setPath(cfg, s.slice(0, eq), s.slice(eq + 1));
    }
    result = install(target, cfg, args);
  }

  const prefix = args.dry ? '[dry-run] ' : '';
  console.log(`${prefix}harness-kit ${VERSION} ${cmd} -> ${target}`);
  for (const l of result.log) console.log(`  ${l}`);
  if (!result.log.length) console.log('  up to date');
  if (result.conflicts.length) {
    console.log(`\n${result.conflicts.length} file(s) were modified locally. Merge the *${NEW_SUFFIX} files by hand, then delete them.`);
  }
}

try {
  main(process.argv.slice(2));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
