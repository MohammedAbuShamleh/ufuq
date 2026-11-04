'use client'

import { useEffect, useState } from 'react'
import { WhatsAppIcon } from './SvgSprite'

/** Shows once the hero is behind the visitor, and steps aside at the contact section. */
export function WhatsAppFloat({ href }: { href: string | null }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const contact = document.getElementById('contact')
      const atContact = contact ? contact.getBoundingClientRect().top < innerHeight * 0.8 : false
      setShow(scrollY > innerHeight * 1.2 && !atContact)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const cls = `wa-float${show ? ' show' : ''}${href ? '' : ' pending'}`
  return href ? (
    <a className={cls} href={href} target="_blank" rel="noopener" aria-label="تحدّث معنا على واتساب" tabIndex={show ? undefined : -1}>
      <WhatsAppIcon size={26} />
    </a>
  ) : (
    <a className={cls} aria-disabled="true" title="رقم واتساب قيد الإعداد" aria-label="تحدّث معنا على واتساب">
      <WhatsAppIcon size={26} />
    </a>
  )
}
