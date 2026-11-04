import type { ComponentProps, ReactNode } from 'react'
import './button.css'

export type ButtonVariant = 'primary' | 'line' | 'wa'

type Common = {
  variant?: ButtonVariant
  size?: 'sm'
  /** Trailing arrow; it points the way the text reads. */
  arrow?: boolean
  className?: string
  children: ReactNode
}

type AsLink = Common & Omit<ComponentProps<'a'>, 'className' | 'children' | 'href'> & { href: string | null }
type AsButton = Common & Omit<ComponentProps<'button'>, 'className' | 'children'> & { href?: undefined }

export function Arrow({ className = 'ico-arrow' }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href="#arr" />
    </svg>
  )
}

/**
 * A pill button or link. A link whose address is not set yet (href null)
 * renders as a dashed «pending» placeholder that goes nowhere.
 */
export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', size, arrow, className, children, ...rest } = props
  const cls = ['btn', `btn-${variant}`, size && `btn-${size}`, className].filter(Boolean).join(' ')
  const body = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  )

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as Omit<AsLink, keyof Common>
    if (href === null) {
      return (
        <a {...anchor} className={`${cls} pending`} aria-disabled="true" title="الرابط قيد الإعداد">
          {body}
        </a>
      )
    }
    return (
      <a {...anchor} href={href} className={cls}>
        {body}
      </a>
    )
  }

  const { type = 'button', ...button } = rest as Omit<AsButton, keyof Common>
  return (
    <button {...button} type={type} className={cls}>
      {body}
    </button>
  )
}
