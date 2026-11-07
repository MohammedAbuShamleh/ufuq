// The "before" picture: the school's fees workbook as it was, drawn in HTML so
// it stays sharp at any width. Decorative; the stage's label describes it.

import type { Dictionary } from '@/i18n/dictionaries/ar'

export function ExcelSheet({ copy }: { copy: Dictionary['compare']['sheet'] }) {
  return (
    <div className="xl" aria-hidden="true">
      <div className="xl-bar">
        <span className="xl-ico">X</span>
        <b>{copy.file}</b>
        <span className="xl-warn">{copy.warn}</span>
      </div>
      <div className="xl-fx">
        <span>fx</span>
        <code>{copy.formula}</code>
      </div>
      <div className="xl-grid">
        <table>
          <thead>
            <tr>
              <th />
              {copy.columns.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
            <tr className="xl-h">
              <th>1</th>
              {copy.header.map((h) => (
                <td key={h}>{h}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {copy.rows.map((row, r) => (
              <tr key={r}>
                <th>{r + 2}</th>
                {row.map((cell, c) =>
                  typeof cell === 'string' ? <td key={c}>{cell}</td> : <td key={c} className={cell[1]}>{cell[0]}</td>,
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="xl-tabs">
        {copy.tabs.map((s, i) => (
          <span key={s} className={i === copy.activeTab ? 'on' : undefined}>
            {s}
          </span>
        ))}
        <span className="xl-more">{copy.more}</span>
      </div>
    </div>
  )
}
