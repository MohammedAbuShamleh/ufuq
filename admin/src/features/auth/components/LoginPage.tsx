import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { errorMessage, fieldErrors } from '@/lib/http'
import { useLogin, useMe } from '../hooks/useAuth'

export function LoginPage() {
  const me = useMe()
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)

  if (me.data) return <Navigate to={from} replace />

  const errors = fieldErrors(loginMutation.error)
  const general = loginMutation.error && !errors.email && !errors.password ? errorMessage(loginMutation.error) : null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email: email.trim(), password, remember }, { onSuccess: () => navigate(from, { replace: true }) })
  }

  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr] bg-surface">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <main className="grid place-items-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <Logo className="mx-auto mb-6 h-16 w-32" />
          <form onSubmit={submit} noValidate className="grid gap-5 rounded-card border border-line bg-bg p-6 shadow-card sm:p-8">
            <div>
              <h1 className="text-xl">تسجيل الدخول</h1>
              <p className="mt-1 text-sm text-muted">لوحة إدارة محتوى موقع أفق.</p>
            </div>
            <TextField label="البريد الإلكتروني" type="email" dir="ltr" autoComplete="username" value={email} onChange={setEmail} error={errors.email} />
            <TextField label="كلمة المرور" type="password" dir="ltr" autoComplete="current-password" value={password} onChange={setPassword} error={errors.password} />
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 cursor-pointer accent-accent" />
              تذكّرني على هذا الجهاز
            </label>
            {general && (
              <p role="alert" className="rounded-field bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
                {general}
              </p>
            )}
            <Button type="submit" busy={loginMutation.isPending} className="w-full">
              دخول
            </Button>
          </form>
          <p className="mt-6 text-center text-xs leading-relaxed text-muted">نسيت كلمة المرور؟ اطلبها من مدير اللوحة في الفريق.</p>
        </div>
      </main>
    </div>
  )
}
