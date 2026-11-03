import { Logo } from './_shell/Logo'
import { ThemeToggle } from './_shell/ThemeToggle'

// Phase 1 placeholder: proves fonts, tokens and both modes.
// Replaced by the ten home sections in phase 3.
const SWATCHES = [
  {
    group: 'ألوان الهوية',
    items: [
      { token: '--terra', className: 'bg-terra' },
      { token: '--brick', className: 'bg-brick' },
      { token: '--olive', className: 'bg-olive' },
      { token: '--ink', className: 'bg-ink' },
      { token: '--linen', className: 'bg-linen' },
      { token: '--blush', className: 'bg-blush' },
    ],
  },
  {
    group: 'ألوان الواجهة حسب الوضع',
    items: [
      { token: '--bg', className: 'bg-bg' },
      { token: '--surface', className: 'bg-surface' },
      { token: '--tint', className: 'bg-tint' },
      { token: '--text', className: 'bg-text' },
      { token: '--muted', className: 'bg-muted' },
      { token: '--line', className: 'bg-line' },
      { token: '--accent', className: 'bg-accent' },
      { token: '--accent-hover', className: 'bg-accent-hover' },
    ],
  },
]

export default function Home() {
  return (
    <>
      <header className="wrap flex items-center justify-between py-4">
        <Logo className="h-14 w-28.5" />
        <ThemeToggle />
      </header>

      <main className="wrap py-16">
        <p className="mb-3 font-display text-sm text-accent">المرحلة الأولى · نظام التصميم</p>
        <h1 className="text-hero font-bold">
          <span className="block">نبني برمجيات</span>
          <span className="block text-accent">تفتح أفقاً أوسع.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          أفق شركة برمجيات من غزة، تبني أنظمة وبرمجيات للجمعيات والمدارس والشركات منذ ٢٠٢٢.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="#tokens" className="rounded-pill bg-accent px-6 py-3 font-display font-medium text-on-accent transition-colors duration-200 ease-brand hover:bg-accent-hover">
            جلسة أولى مجانية
          </a>
          <a href="#tokens" className="rounded-pill border border-accent px-6 py-3 font-display font-medium text-accent transition-colors duration-200 ease-brand hover:bg-accent hover:text-on-accent">
            شاهد أعمالنا
          </a>
        </div>

        <section id="tokens" className="mt-20 grid gap-12">
          {SWATCHES.map(({ group, items }) => (
            <div key={group}>
              <h2 className="text-h2">{group}</h2>
              <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                {items.map(({ token, className }) => (
                  <li key={token}>
                    <span className={`block h-16 rounded-card border border-line ${className}`} />
                    <code dir="ltr" className="mt-2 block text-sm text-muted">{token}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}
