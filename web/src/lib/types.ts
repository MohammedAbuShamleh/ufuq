import type { Locale } from '@/i18n/config'

// Shapes of the public API (GET /v1/*). Text that is still pending arrives as
// null or as a [bracketed] placeholder; see lib/format.ts → isPending.

export type Media = {
  url: string
  mime: string
  width: number | null
  height: number | null
  sizes: { width: number; url: string }[]
}

export type ScreenKind = 'desktop' | 'mobile' | 'video'

export type Screen = {
  kind: ScreenKind
  /** The text under a thumbnail, a phone's caption, a reel chip. */
  label: string | null
  alt: string | null
  file: Media | null
}

export type ProjectType = 'system' | 'website' | 'platform' | 'app'
export type ProjectSector = 'charity' | 'education' | 'government' | 'dawah' | 'business'
/** How a featured project is drawn in «أعمالنا»: each has a layout of its own. */
export type FeaturedLayout = 'showcase' | 'phones' | 'sheet' | 'reel'

type ProjectBase = {
  slug: string
  /** The languages the project has a page in: Arabic always, English once it is translated. */
  locales: Locale[]
  title: string
  client_name: string | null
  tag: string | null
  summary: string | null
  type: ProjectType
  sector: ProjectSector
  country: string | null
  tech_stack: string[] | null
  is_featured: boolean
  featured_layout: FeaturedLayout | null
  /** Up to two figures beside the title in the showcase layout. */
  featured_facts: { value: string; label: string | null }[]
  has_demo_data: boolean
}

export type FeaturedProject = ProjectBase & {
  facts: { value: string; label: string }[]
  highlights: string[]
  screens: Screen[]
}

export type ProjectCard = ProjectBase & { cover: Screen | null }

/** GET /projects/{slug}: a featured card's content plus the story (null while pending). */
export type ProjectDetail = FeaturedProject & {
  challenge: string | null
  solution: string | null
  results: string | null
  testimonial: Testimonial | null
}

export type Client = { name: string; sector_label: string; location: string; logo: Media | null }

export type Testimonial = {
  quote: string | null
  author_name: string | null
  author_title: string | null
  organization: string
}

export type TeamMember = {
  name: string
  role: string
  bio: string | null
  tech: string | null
  is_founder: boolean
  photo: Media | null
}

export type Faq = { question: string; answer: string }

export type Settings = {
  whatsapp_number: string | null
  booking_url: string | null
  contact_email: string | null
  social_links: { linkedin: string | null; x: string | null; instagram: string | null } | null
  profile_pdf: string | null
  hero_tagline: string | null
  why_we_started: string | null
  legal_registration: string | null
  memberships: string | null
  privacy_policy: { heading: string; paragraphs: string[] }[] | null
  privacy_is_draft: boolean
}

export type Home = {
  featured: FeaturedProject[]
  projects: ProjectCard[]
  clients: Client[]
  testimonials: Testimonial[]
  team: TeamMember[]
  faqs: Faq[]
  settings: Settings
}
