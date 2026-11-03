import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'

// Phase 1 placeholder: proves fonts, tokens and both modes. Replaced by the
// login screen and the seven sections in phase 5.
export function App() {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="wrap flex items-center justify-between py-4">
        <Logo className="h-14 w-28.5" />
        <ThemeToggle />
      </header>

      <main className="wrap py-16">
        <p className="mb-3 font-display text-sm text-accent">لوحة التحكم</p>
        <h1 className="text-h2">أهلاً بك في لوحة أفق</h1>
        <p className="mt-4 max-w-prose text-muted">
          من هنا يُدار محتوى الموقع كله دون مبرمج: المشاريع، والفريق، والشهادات، والعملاء، والأسئلة الشائعة، والإعدادات، ورسائل
          التواصل.
        </p>
        <button
          type="button"
          disabled
          className="mt-8 rounded-pill bg-accent px-6 py-3 font-display text-on-accent transition-colors duration-200 ease-brand hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          تسجيل الدخول قريباً
        </button>
      </main>
    </div>
  )
}
