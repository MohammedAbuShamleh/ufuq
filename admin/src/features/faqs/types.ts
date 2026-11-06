import type { Locale, T } from '@/lib/i18n'

export type Faq = { id: number; locales: Locale[]; question: T; answer: T; is_visible: boolean; sort_order: number }

export type FaqInput = { question: T; answer: T; is_visible: boolean }
