import type { Metadata } from 'next'
import Image from 'next/image'
import { ArchClip } from '@/components/ArchClip'
import { Arrow, Button } from '@/components/Button'
import { href } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import { HeadScriptReplay } from '../_shell/HeadScriptReplay'
import './not-found.css'

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).meta.notFound }
}

/** Any address with no page (see [...missing]), and any project that is not published. */
export default async function NotFound() {
  const locale = await getLocale()
  const copy = (await getDictionary(locale)).notFound
  return (
    <main id="top" className="nf-page">
      <HeadScriptReplay />
      <section className="nf" aria-labelledby="nf-title">
        <div className="wrap nf-grid">
          <figure className="nf-art">
            <ArchClip className="nf-clip">
              <Image
                src="/illustrations/404-dead-end.png"
                width={1122}
                height={1402}
                alt={copy.alt}
                sizes="(max-width: 960px) 300px, 420px"
                preload
              />
            </ArchClip>
          </figure>
          <div className="nf-body">
            <span className="nf-code" aria-hidden="true">
              {copy.code}
            </span>
            <h1 id="nf-title">
              {copy.title[0]}
              <br />
              <span>{copy.title[1]}</span>
            </h1>
            <p>{copy.text}</p>
            <div className="nf-actions">
              <Button href={href(locale, '/')}>
                <Arrow className="ico-arrow back" /> {copy.home}
              </Button>
              <Button variant="line" href={href(locale, '/work')}>
                {copy.work}
              </Button>
              <Button variant="line" href={href(locale, '/#contact')}>
                {copy.contact}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
