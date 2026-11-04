export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type Size = 'md' | 'sm'

const BASE =
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-pill font-display whitespace-nowrap transition-colors duration-200 ease-brand disabled:cursor-not-allowed disabled:opacity-55'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line bg-bg text-text hover:border-accent hover:text-accent',
  ghost: 'text-muted hover:bg-surface hover:text-text',
  danger: 'border border-line bg-bg text-danger hover:border-danger hover:bg-danger-soft',
}

const SIZES: Record<Size, string> = {
  md: 'h-10.5 px-5 text-sm',
  sm: 'h-8.5 px-3.5 text-xs',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  [BASE, VARIANTS[variant], SIZES[size], extra].filter(Boolean).join(' ')
