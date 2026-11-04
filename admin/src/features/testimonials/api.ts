import { blank, tr } from '@/lib/i18n'
import { resource } from '@/lib/resource'
import type { Testimonial, TestimonialInput } from './types'

export const testimonials = resource<Testimonial, TestimonialInput>('testimonials')

export const toTestimonialInput = (t: Testimonial): TestimonialInput => ({
  project_id: t.project_id,
  quote: tr(t.quote),
  author_name: tr(t.author_name),
  author_title: tr(t.author_title),
  organization: tr(t.organization),
  status: t.status,
})

export const blankTestimonial = (): TestimonialInput => ({
  project_id: null,
  quote: blank(),
  author_name: blank(),
  author_title: blank(),
  organization: blank(),
  status: 'draft',
})
