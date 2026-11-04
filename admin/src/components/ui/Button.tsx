import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { buttonClass, type Size, type Variant } from './buttonClass'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; busy?: boolean }

export function Button({ variant, size, busy, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} disabled={disabled || busy} aria-busy={busy || undefined} {...rest}>
      {busy && <Spinner />}
      {children}
    </button>
  )
}

export function LinkButton({ variant, size, className, ...rest }: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />
}

export function Spinner({ label }: { label?: string }): ReactNode {
  return (
    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
