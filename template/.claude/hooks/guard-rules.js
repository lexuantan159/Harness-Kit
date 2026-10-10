// Rules for guard-bash.js: dangerous commands, secret files and secret content.
'use strict';

// Each rule: [id, test(segment) -> boolean, reason]. `deny` blocks; `ask` asks the user to confirm.
const DENY_COMMANDS = [
  ['rm-recursive-force', (s) => isRecursiveForceRm(s), 'recursive force delete (rm -rf)'],
  ['git-force-push', (s) => /\bgit\b.*\bpush\b.*(\s--force(-with-lease)?\b|\s-[a-zA-Z]*f\b|\s\+\S+)/.test(s), 'force push rewrites shared history'],
  ['git-reset-hard', (s) => /\bgit\b.*\breset\b.*--hard\b/.test(s), 'git reset --hard discards work'],
  ['git-clean-force', (s) => /\bgit\b.*\bclean\b.*\s-[a-zA-Z]*f/.test(s), 'git clean -f deletes untracked files'],
  ['git-branch-force-delete', (s) => /\bgit\b.*\bbranch\b.*\s-D\b/.test(s), 'force-deleting a branch can lose commits'],
  ['kubectl-delete', (s) => /\bkubectl\b.*\bdelete\b/.test(s), 'deletes cluster resources'],
  ['terraform-destroy', (s) => /\bterraform\b.*\bdestroy\b/.test(s), 'destroys infrastructure'],
  ['docker-prune', (s) => /\bdocker\b.*\b(system|volume|image)\s+prune\b/.test(s), 'deletes docker data'],
  ['disk-wipe', (s) => /\b(mkfs(\.\w+)?|shred|wipefs)\b|\bdd\b.*\bof=\/dev\//.test(s), 'wipes a disk or device'],
  ['chmod-world-writable', (s) => /\bchmod\b.*\s(-[a-zA-Z]*R[a-zA-Z]*|--recursive)\s.*\b777\b/.test(s), 'recursive chmod 777'],
  ['pipe-to-shell', (s) => /\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(ba|z)?sh\b/.test(s), 'runs a downloaded script'],
];

// Checked on the raw command (SQL usually sits inside quotes) when a SQL client is involved.
const SQL_CLIENT = /\b(psql|mysql|mariadb|sqlcmd|sqlite3|mongo(sh)?|clickhouse(-client)?|snowsql|bq|cqlsh|duckdb)\b/;
const SQL_RULES = [
  ['sql-destructive', (s) => /\b(drop\s+(table|database|schema)|truncate\s+(table\s+)?[\w."]+)/i.test(s), 'destructive SQL'],
  ['sql-delete-all', (s) => /\bdelete\s+from\s+[\w."]+\s*(;|$|["'])/i.test(s), 'DELETE without WHERE'],
  ['mongo-drop', (s) => /\.(drop|dropDatabase)\(\)/.test(s), 'drops a MongoDB collection/database'],
];

const ASK_COMMANDS = [
  ['sudo', (s) => /(^|\s)sudo\s/.test(s), 'runs with root privileges'],
  ['git-push', (s) => /\bgit\b.*\bpush\b/.test(s), 'publishes commits to the remote'],
  ['publish', (s) => /\b(npm|pnpm|yarn)\s+publish\b|\bmvn\b.*\bdeploy\b|\btwine\s+upload\b|\bdocker\s+push\b/.test(s), 'publishes an artefact'],
  ['terraform-apply', (s) => /\bterraform\b.*\bapply\b/.test(s), 'changes infrastructure'],
  ['find-delete', (s) => /\bfind\b.*\s(-delete|-exec\s+rm)\b/.test(s), 'bulk delete via find'],
];

// Files that hold credentials. Templates (.env.example etc.) are fine.
const SECRET_FILE = /(^|[\s/'"=@:])(\.env(\.(?!example\b|sample\b|template\b|dist\b)[\w.-]+)?|id_(rsa|dsa|ecdsa|ed25519)|[\w.-]+\.(pem|key|p12|pfx|jks|keystore)|\.npmrc|\.pypirc|credentials\.json|service-account[\w.-]*\.json)(?=$|[\s'";|&)])/;
const SECRET_PATH = /(^|\/)(\.env(\.(?!example$|sample$|template$|dist$)[\w.-]+)?|id_(rsa|dsa|ecdsa|ed25519)|[^/]+\.(pem|key|p12|pfx|jks|keystore)|\.npmrc|\.pypirc|credentials\.json|service-account[^/]*\.json)$/;

// Commands that read, copy or send file contents.
const READERS = /^(cat|less|more|head|tail|grep|egrep|rg|ag|awk|sed|cut|sort|strings|xxd|od|hexdump|base64|openssl|cp|mv|scp|rsync|curl|wget|nc|ncat|tar|zip|gzip|tee|source|\.|export|env|printenv|python3?|node|ruby|perl)$/;

// High-confidence secret formats -> deny. Values are never echoed back.
const SECRET_CONTENT = [
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['aws-access-key', /\b(AKIA|ASIA)[0-9A-Z]{16}\b/],
  ['github-token', /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{60,})\b/],
  ['gitlab-token', /\bglpat-[A-Za-z0-9_-]{20,}\b/],
  ['slack-token', /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['stripe-live-key', /\b[sr]k_live_[0-9a-zA-Z]{24,}\b/],
  ['openai-anthropic-key', /\bsk-(ant-|proj-)?[A-Za-z0-9_-]{32,}\b/],
  ['teams-webhook', /https:\/\/[\w.-]*(webhook\.office\.com|logic\.azure\.com)\/[^\s'"]+/],
  ['jwt', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
];

// Looks like a hard-coded credential -> ask (may be a test fixture).
const GENERIC_SECRET = /\b(password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|private[_-]?key)\b["']?\s*[:=]\s*["']([^"'\s]{8,})["']/i;
const PLACEHOLDER = /^(\$\{.*\}|<.*>|%.*%|\{\{.*\}\}|x{4,}|\*{4,}|changeme|change-me|example\w*|dummy\w*|test\w*|placeholder|your[-_].*)$/i;

// Add this marker on a line to allow a known-safe match (e.g. a test fixture).
const ALLOW_MARKER = 'harness-allow-secret';

function isRecursiveForceRm(segment) {
  const tokens = segment.split(/\s+/);
  const at = tokens.findIndex((t) => /(^|\/)rm$/.test(t));
  if (at < 0) return false;
  let recursive = false;
  let force = false;
  for (const t of tokens.slice(at + 1)) {
    if (t === '--') break;
    if (t === '--recursive') recursive = true;
    else if (t === '--force') force = true;
    else if (/^-[a-zA-Z]+$/.test(t)) {
      if (/[rR]/.test(t)) recursive = true;
      if (t.includes('f')) force = true;
    }
  }
  return recursive && force;
}

module.exports = {
  DENY_COMMANDS, ASK_COMMANDS, SQL_CLIENT, SQL_RULES, SECRET_FILE, SECRET_PATH, READERS,
  SECRET_CONTENT, GENERIC_SECRET, PLACEHOLDER, ALLOW_MARKER,
};
