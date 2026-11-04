'use client'

import { useMotionToggle } from '@/hooks/useMotionToggle'

export function FooterMotionToggle() {
  const { off, toggle } = useMotionToggle()
  return (
    // A toggle keeps one name ("stop motion"); pressed says it is in effect.
    <button type="button" className="link-btn" aria-label="إيقاف الحركة" aria-pressed={off} onClick={toggle}>
      {off ? 'تشغيل الحركة' : 'إيقاف الحركة'}
    </button>
  )
}
