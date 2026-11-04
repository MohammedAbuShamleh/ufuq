import type { ComponentProps } from 'react'

// The arch from the logo, as a clip path in the box's own units. Defined once
// on the page (the layout renders <ArchClipDef/>); everything arched uses it.
export const ARCH_CLIP_ID = 'archShape'

export function ArchClipDef() {
  return (
    <clipPath id={ARCH_CLIP_ID} clipPathUnits="objectBoundingBox">
      <path d="M0 1V.44C0 .2.28.06.5 0 .72.06 1 .2 1 .44V1Z" />
    </clipPath>
  )
}

export function ArchClip({ style, ...props }: ComponentProps<'div'>) {
  return <div {...props} style={{ ...style, clipPath: `url(#${ARCH_CLIP_ID})` }} />
}
