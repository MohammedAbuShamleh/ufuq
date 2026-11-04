import { blank, tr } from '@/lib/i18n'
import { resource } from '@/lib/resource'
import type { Faq, FaqInput } from './types'

export const faqs = resource<Faq, FaqInput>('faqs')

export const toFaqInput = (f: Faq): FaqInput => ({ question: tr(f.question), answer: tr(f.answer), is_visible: f.is_visible })

export const blankFaq = (): FaqInput => ({ question: blank(), answer: blank(), is_visible: true })
