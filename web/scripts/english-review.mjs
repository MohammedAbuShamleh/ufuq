// Writes docs/i18n/english-review.html: every Arabic string beside its English, so
// the team can review the translation in one place. Two parts:
//   - the site's own copy, from src/i18n/dictionaries (edited in en.ts),
//   - the drafts for the seeded content, from api/database/seeders/data/english-drafts.php
//     (edited afterwards in the dashboard's English tab), grouped by that file's comments.
//
//   node --experimental-strip-types web/scripts/english-review.mjs [page.html]
//
// A second path also writes the same page without its <html>/<head>/<body> wrapper,
// the form a claude.ai page is published from. Needs php on the PATH.

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
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

// Where each dictionary section shows on the site, in the words the team uses.
const LABELS = {
  meta: 'Page titles and descriptions',
  common: 'Shared words',
  nav: 'Menu',
  footer: 'Footer',
  whatsapp: 'WhatsApp button',
  hero: 'Home · opening',
  compare: 'Home · Excel and the system',
  featured: 'Home · featured work',
  layouts: 'Featured work · labels',
  otherWork: 'Home · other projects',
  work: 'Kinds, sectors and countries',
  stats: 'Figures',
  aboutTeaser: 'Home · about us',
  team: 'Team cards',
  voices: 'Home · testimonials and clients',
  services: 'Home · services',
  approach: 'Home · how we work',
  journey: 'Home · what happens next',
  contact: 'Home · let’s begin',
  contactForm: 'Contact form',
  support: 'Support strip',
  notFound: '404 page',
  aboutPage: 'About page',
  logoStory: 'About · the story of the logo',
  workPage: 'Work page',
  project: 'Project page',
  privacy: 'Privacy page',
}

/** Every text leaf of the Arabic dictionary with its key path and the English at the same path. */
function pairs(a, e, at = []) {
  if (typeof a === 'string') return [{ key: at.join('.'), ar: a, en: typeof e === 'string' ? e : null }]
  if (a && typeof a === 'object') return Object.keys(a).flatMap((k) => pairs(a[k], e?.[k], [...at, k]))
  return []
}

const ARABIC = /[؀-ۿ]/
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// {placeholders} are filled in by the site; [brackets] are text still to come.
const mark = (s) => esc(s).replace(/\{\w+\}/g, '<code>$&</code>').replace(/^\[.*\]$/s, '<span class="pending">$&</span>')
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const flag = (english) => (english === null ? 'missing' : ARABIC.test(english) ? 'arabic' : '')

// Site copy, one section per top-level dictionary key.
const copy = new Map()
for (const p of pairs(ar, en)) {
  const top = p.key.split('.')[0]
  if (!copy.has(top)) copy.set(top, [])
  copy.get(top).push({ where: p.key.slice(top.length + 1) || top, ar: p.ar, en: p.en })
}

// Content drafts, under the comment heading that precedes each one in the PHP file.
const source = readFileSync(draftsFile, 'utf8')
const headings = [...source.matchAll(/^\s*\/\/\s*(.+)$/gm)].map((m) => ({ at: m.index, title: m[1].trim() }))
const content = new Map()
for (const [a, e] of Object.entries(drafts)) {
  const at = source.indexOf(`'${a}'`)
  const title = headings.filter((h) => h.at < (at < 0 ? Infinity : at)).at(-1)?.title ?? 'Other'
  if (!content.has(title)) content.set(title, [])
  content.get(title).push({ where: null, ar: a, en: e })
}

const row = (r) =>
  `<tr class="${flag(r.en)}">${r.where === null ? '' : `<td class="where">${esc(r.where)}</td>`}<td class="ar" lang="ar" dir="rtl">${mark(r.ar)}</td><td class="en">${r.en === null ? '<em>missing</em>' : mark(r.en)}</td></tr>`

const section = (id, title, rows, withWhere) => `
    <section class="part" id="${id}">
      <h3>${esc(title)} <span class="n">${rows.length}</span></h3>
      <div class="scroll"><table>
        <colgroup>${withWhere ? '<col class="c-where">' : ''}<col><col></colgroup>
        ${rows.map(row).join('\n        ')}
      </table></div>
    </section>`

const copyCount = [...copy.values()].reduce((n, rows) => n + rows.length, 0)
const draftCount = Object.keys(drafts).length
const flagged = [...copy.values(), ...content.values()].flat().filter((r) => flag(r.en)).length
const copyIds = [...copy.keys()].map((k) => [`s-${slug(k)}`, LABELS[k] ?? k, k])
// A heading's short form, before any colon or parenthesis, names its chip and its part.
const short = (t) => t.split(/[:(]/)[0].trim()
const contentIds = [...content.keys()].map((t) => [`c-${slug(short(t))}`, short(t), t])

const head = `<title>UFUQ English review</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap">
<style>
  /* Layout: one reading column; each part is a table of where the text sits, its Arabic and its English, side by side. */
  :root {
    --bg: #ffffff; --surface: #f7f7f6; --text: #1e1e1a; --muted: #66645d; --line: #e9e7e3;
    --accent: #a3463d; --olive: #4e4c34; --flag: #f6e3df;
    --sans: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif;
    --mono: 'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #15181d; --surface: #1b1e24; --text: #eee8dd; --muted: #a9a595; --line: #2c2f35;
      --accent: #d9705f; --olive: #c9c4a0; --flag: #3a2620; color-scheme: dark;
    }
  }
  :root[data-theme="dark"] {
    --bg: #15181d; --surface: #1b1e24; --text: #eee8dd; --muted: #a9a595; --line: #2c2f35;
    --accent: #d9705f; --olive: #c9c4a0; --flag: #3a2620; color-scheme: dark;
  }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.65 var(--sans); }
  .page {
    padding-block: 48px 96px;
    padding-left: max(16px, env(safe-area-inset-left, 0px));
    padding-right: max(16px, env(safe-area-inset-right, 0px));
  }
  main { max-width: 1120px; margin: 0 auto; display: grid; gap: 28px; }
  header { display: grid; gap: 12px; }
  .kicker { margin: 0; font-size: .8rem; font-weight: 500; letter-spacing: .06em; text-transform: uppercase; color: var(--accent); }
  h1 { margin: 0; font-size: clamp(1.9rem, 4vw, 2.6rem); line-height: 1.15; font-weight: 600; text-wrap: balance; }
  h2 { margin: 0; font-size: 1.3rem; font-weight: 600; text-wrap: balance; }
  h3 { margin: 0 0 8px; font-size: 1rem; font-weight: 600; color: var(--olive); display: flex; align-items: baseline; gap: 8px; }
  .lead { margin: 0; max-width: 68ch; color: var(--muted); }
  .figures { display: flex; flex-wrap: wrap; gap: 8px 28px; margin: 4px 0 0; padding: 0; list-style: none; }
  .figures b { font-size: 1.35rem; font-weight: 600; font-variant-numeric: tabular-nums; margin-inline-end: 6px; }
  .figures li { color: var(--muted); }
  .figures .warn b { color: var(--accent); }
  .tools { display: grid; gap: 14px; padding: 16px; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; }
  .find { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
  .find label { font-weight: 500; }
  .find input { flex: 1 1 260px; min-width: 0; font: inherit; padding: 8px 12px; color: var(--text); background: var(--bg); border: 1px solid var(--line); border-radius: 8px; }
  .find input:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
  .find output { color: var(--muted); font-size: .85rem; font-variant-numeric: tabular-nums; }
  nav { display: grid; gap: 6px; }
  nav p { margin: 0; font-size: .8rem; color: var(--muted); }
  nav div { display: flex; flex-wrap: wrap; gap: 6px; }
  nav a { font-size: .82rem; padding: 2px 10px; border: 1px solid var(--line); border-radius: 99px; color: var(--text); text-decoration: none; background: var(--bg); }
  nav a:hover, nav a:focus-visible { border-color: var(--accent); color: var(--accent); outline: none; }
  .block { display: grid; gap: 22px; }
  .block > p { margin: -12px 0 0; max-width: 68ch; color: var(--muted); }
  .part { min-width: 0; scroll-margin-top: 16px; }
  .n { font-weight: 400; font-size: .8rem; color: var(--muted); font-variant-numeric: tabular-nums; }
  .scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  col.c-where { width: 21%; }
  td { vertical-align: top; padding: 9px 10px; border-top: 1px solid var(--line); overflow-wrap: anywhere; }
  td.where { font: 12px/1.6 var(--mono); color: var(--muted); padding-top: 11px; }
  td.ar { font-size: 15.5px; }
  tr.missing td.en, tr.arabic td.en { background: var(--flag); }
  code { font: .85em var(--mono); padding: 0 4px; border-radius: 4px; background: var(--surface); border: 1px solid var(--line); }
  .pending { color: var(--muted); font-style: italic; }
  .empty { color: var(--muted); }
  @media (max-width: 720px) { col.c-where, td.where { display: none; } td { padding-inline: 6px; } }
</style>`

const body = `<div class="page" lang="en">
<main>
  <header>
    <p class="kicker">UFUQ · English version</p>
    <h1>English review</h1>
    <p class="lead">Every Arabic text on the site beside its English draft. The site copy is changed in <code>web/src/i18n/dictionaries/en.ts</code>. The content drafts are changed in the dashboard’s English tab once they are seeded. <code>{name}</code> is filled in by the site, and <span class="pending">[bracketed]</span> text is still to come, in both languages.</p>
    <ul class="figures">
      <li><b>${copyCount}</b>site texts</li>
      <li><b>${draftCount}</b>content drafts</li>
      <li class="${flagged ? 'warn' : ''}"><b>${flagged}</b>${flagged ? 'need attention (highlighted)' : 'missing or still in Arabic'}</li>
    </ul>
  </header>

  <div class="tools">
    <div class="find">
      <label for="q">Find</label>
      <input id="q" type="search" placeholder="A word in Arabic or English" autocomplete="off">
      <output id="count" for="q" aria-live="polite">${copyCount + draftCount} texts</output>
    </div>
    <nav aria-label="Parts">
      <p>Site copy</p>
      <div>${copyIds.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}</div>
      <p>Content drafts</p>
      <div>${contentIds.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}</div>
    </nav>
  </div>

  <div class="block">
    <h2>Site copy</h2>
    <p>Fixed text written into the site: menus, headings, buttons, forms and page descriptions. On a wide screen, the grey column gives each text’s key in <code>en.ts</code>.</p>
    ${copyIds.map(([id, label, key]) => section(id, label, copy.get(key), true)).join('')}
  </div>

  <div class="block">
    <h2>Content drafts</h2>
    <p>Projects, clients, team, testimonials, FAQs and settings, as the draft seeder writes them. Client names follow each project’s address; check each client’s own spelling. The privacy policy is a legal text, so a person must review its English before it goes live.</p>
    ${contentIds.map(([id, label, title]) => section(id, label, content.get(title), false)).join('')}
  </div>
  <p class="empty" id="none" hidden>No text matches that search.</p>
</main>
</div>
<script>
  // Find: shows only the rows whose Arabic or English contains the search, and hides empty parts.
  const q = document.getElementById('q')
  const count = document.getElementById('count')
  const none = document.getElementById('none')
  const rows = [...document.querySelectorAll('table tr')]
  const text = new Map(rows.map((r) => [r, r.textContent.toLowerCase()]))
  q.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase()
    let shown = 0
    for (const r of rows) {
      const hit = !term || text.get(r).includes(term)
      r.hidden = !hit
      if (hit) shown++
    }
    for (const part of document.querySelectorAll('.part')) part.hidden = !part.querySelector('tr:not([hidden])')
    for (const block of document.querySelectorAll('.block')) block.hidden = !block.querySelector('.part:not([hidden])')
    count.textContent = term ? shown + ' of ' + rows.length + ' texts' : rows.length + ' texts'
    none.hidden = shown > 0
  })
</script>`

const out = path.join(root, 'docs/i18n/english-review.html')
mkdirSync(path.dirname(out), { recursive: true })
writeFileSync(out, `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n</body>\n</html>\n`)
console.log(`${path.relative(root, out)}: ${copyCount} site texts, ${draftCount} content drafts, ${flagged} flagged, ${content.size} content groups`)

if (process.argv[2]) {
  writeFileSync(process.argv[2], `${head}\n${body}\n`)
  console.log(`page without its wrapper: ${process.argv[2]}`)
}
