#!/usr/bin/env node
// Builds docs/ai/dashboard.html: a static overview of harness activity in this project.
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const ai = path.join(root, 'docs', 'ai');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function list(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const out = [];
  for (const e of fs.readdirSync(full, { withFileTypes: true })) {
    const p = path.join(full, e.name);
    if (e.isDirectory()) out.push(...list(path.join(dir, e.name)));
    else if (e.name.endsWith('.md')) out.push({ rel: path.join(dir, e.name), mtime: fs.statSync(p).mtime });
  }
  return out.sort((a, b) => b.mtime - a.mtime);
}

function firstHeading(rel) {
  const m = /^#\s+(.+)$/m.exec(fs.readFileSync(path.join(root, rel), 'utf8'));
  return m ? m[1] : path.basename(rel, '.md');
}

function section(title, dir) {
  const items = list(dir);
  const rows = items.length
    ? items.map((i) => `<li><a href="${esc(path.relative(ai, path.join(root, i.rel)).split(path.sep).join('/'))}">${esc(firstHeading(i.rel))}</a>` +
        `<span>${i.mtime.toISOString().slice(0, 16).replace('T', ' ')}</span></li>`).join('')
    : '<li class="empty">Nothing yet</li>';
  return `<section><h2>${esc(title)} <small>${items.length}</small></h2><ul>${rows}</ul></section>`;
}

let version = 'unknown';
try { version = fs.readFileSync(path.join(root, '.harness-version'), 'utf8').trim(); } catch { /* not installed by kit */ }

const docs = ['ARCHITECTURE.md', 'SCHEMA.md', 'BUSINESS.md'].map((d) => {
  let state = 'missing';
  try {
    state = fs.readFileSync(path.join(ai, 'context', d), 'utf8').includes('<!-- harness:placeholder -->') ? 'placeholder' : 'generated';
  } catch { /* missing */ }
  return `<li><a href="context/${d}">${d}</a><span class="${state}">${state}</span></li>`;
}).join('');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Harness dashboard</title>
<style>
:root{--bg:#fafafa;--fg:#1d1d1f;--muted:#6e6e73;--card:#fff;--line:#e5e5ea;--ok:#1a7f37;--warn:#9a6700}
@media (prefers-color-scheme:dark){:root{--bg:#161618;--fg:#f2f2f7;--muted:#a1a1a6;--card:#1f1f22;--line:#2c2c30;--ok:#3fb950;--warn:#d29922}}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
main{max-width:960px;margin:auto;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
header{max-width:960px;margin:0 auto 16px}h1{margin:0;font-size:22px}header p{margin:4px 0 0;color:var(--muted)}
section{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px}
h2{font-size:15px;margin:0 0 8px}small{color:var(--muted);font-weight:400}
ul{list-style:none;margin:0;padding:0}li{display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-top:1px solid var(--line)}
li:first-child{border-top:0}a{color:inherit}span{color:var(--muted);font-size:13px;white-space:nowrap}
.generated{color:var(--ok)}.placeholder,.missing{color:var(--warn)}.empty{color:var(--muted)}
</style></head><body>
<header><h1>Harness dashboard</h1><p>harness-kit ${esc(version)} &middot; generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')}</p></header>
<main>
<section><h2>Context docs</h2><ul>${docs}</ul></section>
${section('Harness issues', 'docs/ai/report')}
${section('Plans', 'docs/ai/plans')}
${section('Specs', 'docs/ai/specs')}
${section('Reviews', 'docs/ai/reviews')}
${section('Sessions', 'docs/ai/sessions')}
${section('Assessments', 'docs/ai/assessments')}
${section('Research', 'docs/research')}
</main></body></html>
`;

const out = path.join(ai, 'dashboard.html');
fs.mkdirSync(ai, { recursive: true });
fs.writeFileSync(out, html);
console.log(out);
