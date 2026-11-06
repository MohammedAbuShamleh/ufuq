// Writes docs/i18n/english-review.html: every Arabic string beside its English, so
// the team can review the translation in one place. Two parts:
//   - the site's own copy, from src/i18n/dictionaries (edited in en.ts),
//   - the drafts for the seeded content, from api/database/seeders/data/english-drafts.php
//     (edited afterwards in the dashboard's English tab).
//
//   node --experimental-strip-types web/scripts/english-review.mjs
//
// Needs php on the PATH to read the drafts file.

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const { ar } = await import('../src/i18n/dictionaries/ar.ts')
const { en } = await import('../src/i18n/dictionaries/en.ts')

const draftsFile = path.join(root, 'api/database/seeders/data/english-drafts.php')
const drafts = JSON.parse(
  execFileSync('php', ['-r', `echo json_encode(require $argv[1], JSON_UNESCAPED_UNICODE);`, draftsFile], { encoding: 'utf8' }),
)

/** Every text leaf of the Arabic dictionary with its key path and the English at the same path. */
function pairs(a, e, at = []) {
  if (typeof a === 'string') return [{ key: at.join('.'), ar: a, en: typeof e === 'string' ? e : null }]
  if (a && typeof a === 'object') return Object.keys(a).flatMap((k) => pairs(a[k], e?.[k], [...at, k]))
  return []
}

const ARABIC = /[؀-ۿ]/
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// {placeholders} are filled in by the site; [brackets] are text still to come.
const mark = (s) => esc(s).replace(/\{\w+\}/g, '<code>$&</code>').replace(/^\[.*\]$/s, '<span class="pending">$&</span>')

const sections = new Map()
for (const p of pairs(ar, en)) {
  const top = p.key.split('.')[0]
  if (!sections.has(top)) sections.set(top, [])
  sections.get(top).push(p)
}

const flag = (p) => (p.en === null ? 'missing' : ARABIC.test(p.en) ? 'arabic' : '')
const row = (key, a, e, cls) =>
  `<tr class="${cls}">${key === null ? '' : `<td class="key">${esc(key)}</td>`}<td class="ar" lang="ar" dir="rtl">${mark(a)}</td><td class="en" lang="en">${e === null ? '<em>missing</em>' : mark(e)}</td></tr>`

const copyCount = [...sections.values()].reduce((n, rows) => n + rows.length, 0)
const draftRows = Object.entries(drafts)
const problems = [...sections.values()].flat().filter(flag).length

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>UFUQ English review</title>
<style>
  :root { --bg: #fbfaf7; --text: #15181d; --muted: #6b6f76; --line: #e7e2d8; --accent: #a3463d; --soft: #f3eee5; }
  @media (prefers-color-scheme: dark) { :root { --bg: #14161a; --text: #ece8e1; --muted: #9a9ea6; --line: #2b2f36; --accent: #e08a7f; --soft: #1d2026; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.6 system-ui, "Segoe UI", sans-serif; }
  main { max-width: 1180px; margin: 0 auto; padding: 40px 16px 80px; }
  h1 { font-size: 1.8rem; margin: 0 0 .4rem; }
  h2 { font-size: 1.15rem; margin: 2.4rem 0 .6rem; color: var(--accent); }
  p.lead { color: var(--muted); max-width: 70ch; margin: 0 0 1rem; }
  nav { display: flex; flex-wrap: wrap; gap: 6px; margin: 1.2rem 0; }
  nav a { font-size: .82rem; padding: 3px 10px; border: 1px solid var(--line); border-radius: 99px; color: var(--text); text-decoration: none; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  td { vertical-align: top; padding: 8px 10px; border-top: 1px solid var(--line); overflow-wrap: anywhere; }
  td.key { width: 22%; font: 12px/1.5 ui-monospace, Menlo, monospace; color: var(--muted); }
  td.ar { font-family: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif; }
  tr.missing td.en, tr.arabic td.en { background: color-mix(in srgb, var(--accent) 14%, transparent); }
  code { font-size: .85em; padding: 0 3px; border-radius: 4px; background: var(--soft); }
  .pending { color: var(--muted); font-style: italic; }
  .wrap { overflow-x: auto; }
  @media (max-width: 720px) { td.key { display: none; } }
</style>
</head>
<body>
<main>
  <h1>UFUQ English review</h1>
  <p class="lead">Every Arabic text on the site beside its English. ${copyCount} strings of site copy and ${draftRows.length} drafts for the seeded content${problems ? `; <strong>${problems} need attention</strong> (highlighted)` : ''}. Site copy is changed in <code>web/src/i18n/dictionaries/en.ts</code>; the content drafts are changed in the dashboard’s English tab once seeded.</p>
  <p class="lead"><code>{name}</code> is filled in by the site. <span class="pending">[Bracketed]</span> text is still to come, in both languages.</p>
  <nav>${[...sections.keys()].map((k) => `<a href="#${k}">${k}</a>`).join('')}<a href="#content">content drafts</a></nav>
  ${[...sections.entries()]
    .map(
      ([top, rows]) =>
        `<h2 id="${top}">${top}</h2><div class="wrap"><table>${rows.map((p) => row(p.key.slice(top.length + 1) || top, p.ar, p.en, flag(p))).join('')}</table></div>`,
    )
    .join('\n  ')}
  <h2 id="content">Content drafts</h2>
  <p class="lead">Projects, clients, team, testimonials, FAQs and settings. The privacy policy is a legal text: a person must review its English before it goes live.</p>
  <div class="wrap"><table>${draftRows.map(([a, e]) => row(null, a, e, ARABIC.test(e) ? 'arabic' : '')).join('')}</table></div>
</main>
</body>
</html>
`

const out = path.join(root, 'docs/i18n/english-review.html')
mkdirSync(path.dirname(out), { recursive: true })
writeFileSync(out, html)
console.log(`${path.relative(root, out)}: ${copyCount} site strings, ${draftRows.length} content drafts, ${problems} flagged`)
