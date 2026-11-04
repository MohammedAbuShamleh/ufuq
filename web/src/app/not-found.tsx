import type { Metadata } from 'next'
import Image from 'next/image'
import { ArchClip } from '@/components/ArchClip'
import { Arrow, Button } from '@/components/Button'
import './not-found.css'

export const metadata: Metadata = { title: 'الصفحة غير موجودة' }

/** Any address with no page, and any project that is not published. */
export default function NotFound() {
  return (
    <main id="top" className="nf-page">
      <section className="nf" aria-labelledby="nf-title">
        <div className="wrap nf-grid">
          <figure className="nf-art">
            <ArchClip className="nf-clip">
              <Image
                src="/illustrations/404-dead-end.png"
                width={1122}
                height={1402}
                alt="طريق ورقي بين التلال ينتهي عند حافة، وعليه لافتة خشبية تشير إلى الخلف"
                sizes="(max-width: 960px) 300px, 420px"
                preload
              />
            </ArchClip>
          </figure>
          <div className="nf-body">
            <span className="nf-code" aria-hidden="true">
              ٤٠٤
            </span>
            <h1 id="nf-title">
              هذا الطريق
              <br />
              <span>لا يؤدي إلى الأفق.</span>
            </h1>
            <p>الصفحة التي تبحث عنها غير موجودة، أو نُقلت إلى مكان آخر. اللافتة تشير إلى طريق العودة.</p>
            <div className="nf-actions">
              <Button href="/">
                <Arrow className="ico-arrow back" /> العودة للرئيسية
              </Button>
              <Button variant="line" href="/work">
                أعمالنا
              </Button>
              <Button variant="line" href="/#contact">
                تواصل معنا
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
