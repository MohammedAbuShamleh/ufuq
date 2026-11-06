'use client'

import { useMotionToggle } from '@/hooks/useMotionToggle'

export function FooterMotionToggle() {
  const { off, toggle } = useMotionToggle()
  return (
    // The visible words are the name and say what a press does, so no pressed state.
    <button type="button" className="link-btn" onClick={toggle}>
      {off ? 'تشغيل الحركة' : 'إيقاف الحركة'}
    </button>
  )
}
