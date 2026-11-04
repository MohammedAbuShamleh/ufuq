// The "before" picture: the school's fees workbook as it was, drawn in HTML so
// it stays sharp at any width. Decorative; the stage's label describes it.

type Cell = string | [text: string, mark: 'hl' | 'err' | 'warn']

const COLUMNS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز']
const HEADER = ['اسم الطالب', 'الصف', 'الرسوم', 'المدفوع', 'الباقي', 'الخصم', 'ملاحظات']
const ROWS: Cell[][] = [
  ['أحمد سالم', 'الرابع', '2,200', '500', '1,700', '', ''],
  ['لين محمود', 'الأول', '1,800', ['1,800', 'hl'], '0', '', 'عدّلته يدوياً'],
  ['يوسف خالد', 'الثاني', '1,800', '1,800', ['#REF!', 'err'], '', ''],
  ['سارة عمر', 'الرابع', '1,800', '1,200', '600', '', ''],
  ['محمد حسن', 'الرابع', '2,000', '0', ['#VALUE!', 'err'], '', ''],
  ['جنى رامي', 'الأول', ['1,800', 'hl'], '500', '1,300', '', ''],
  ['عمر نبيل', 'الثاني', '2,400', '0', '2,400', '', ''],
  ['ريم أيمن', 'الرابع', '2,000', '900', ['#REF!', 'err'], '10%', ''],
  ['خالد سمير', 'الثالث', '1,800', '1,800', '0', '', ''],
  ['هالة وليد', 'الثاني', '2,000', ['0', 'hl'], '2,000', '', 'عدّلته يدوياً'],
  ['زيد فادي', 'الأول', '1,800', '1,800', '0', '', ['؟؟ راجع ورقة 37', 'warn']],
  ['مريم جمال', 'الثاني', '1,800', '1,800', '0', '200', ''],
  ['آدم طارق', 'الرابع', '2,400', '900', '1,500', '', ''],
  ['تالا ماهر', 'الثالث', '2,400', '900', '1,500', '10%', ''],
]
const SHEETS = ['الرسوم', 'الرسوم (2)', 'الرسوم نهائي', 'الرواتب', 'الرواتب قديم', 'المخزن', 'الحضور', 'نسخة احتياطية', 'ورقة37', 'ورقة38']

export function ExcelSheet() {
  return (
    <div className="xl" aria-hidden="true">
      <div className="xl-bar">
        <span className="xl-ico">X</span>
        <b>رسوم_الطلاب_2026_نهائي_معدّل3.xlsx</b>
        <span className="xl-warn">تم التعديل بواسطة ٤ أشخاص</span>
      </div>
      <div className="xl-fx">
        <span>fx</span>
        <code>=SUM(D4:D61)+&apos;ورقة37&apos;!F12-&apos;الرسوم (2)&apos;!E9</code>
      </div>
      <div className="xl-grid">
        <table>
          <thead>
            <tr>
              <th />
              {COLUMNS.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
            <tr className="xl-h">
              <th>1</th>
              {HEADER.map((h) => (
                <td key={h}>{h}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, r) => (
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
        {SHEETS.map((s) => (
          <span key={s} className={s === 'الرسوم نهائي' ? 'on' : undefined}>
            {s}
          </span>
        ))}
        <span className="xl-more">+٤٨ ورقة</span>
      </div>
    </div>
  )
}
