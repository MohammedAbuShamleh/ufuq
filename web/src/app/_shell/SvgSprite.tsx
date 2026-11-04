import { ArchClipDef } from '@/components/ArchClip'

/** Shapes the whole page reuses by id: the arch clip, the arrow and WhatsApp icons. */
export function SvgSprite() {
  return (
    <svg width="0" height="0" className="sprite" aria-hidden="true">
      <defs>
        <ArchClipDef />
      </defs>
      <symbol id="wa" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.9-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
      </symbol>
      <symbol id="arr" viewBox="0 0 24 24">
        <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
    </svg>
  )
}

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} aria-hidden="true">
      <use href="#wa" />
    </svg>
  )
}
