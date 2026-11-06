import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/i18n/server'

// The page is nothing but notFound(), so it has no static shell: this exempts
// it from Cache Components' check that every page has one (see the `instant`
// docs). The 404 status comes from notFound() itself.
export const instant = false

// A thrown 404 keeps the page's own head, so the tab names the 404 here.
export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.notFound }
}

/**
 * Any address under a language that no page answers: the site's own 404,
 * inside the layout (a root layout under [lang] leaves Next no other way to
 * reach not-found.tsx for an unknown address). Next answers a thrown 404 with
 * an empty shell that the browser fills in, hence HeadScriptReplay.
 */
export default function MissingPage() {
  notFound()
}
