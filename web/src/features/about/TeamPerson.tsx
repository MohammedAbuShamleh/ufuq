'use client'

import { useState } from 'react'
import { isPending } from '@/lib/format'
import { imgAttrs } from '@/lib/media'
import type { TeamMember } from '@/lib/types'

/** A teammate: the photo is grey until clicked (or hovered with a mouse). */
export function TeamPerson({ member }: { member: TeamMember }) {
  const [color, setColor] = useState(false)
  const role = member.is_founder ? `شريك مؤسس · ${member.role}` : member.role

  return (
    <div className={`ab-p${color ? ' color' : ''}`}>
      {member.photo ? (
        <button type="button" className="ab-av ph" aria-pressed={color} aria-label="إظهار الصورة بالألوان" onClick={() => setColor((c) => !c)}>
          {/* eslint-disable-next-line @next/next/no-img-element -- the API already serves the webp widths (see imgAttrs) */}
          <img {...imgAttrs(member.photo, '58px')} alt={member.name} />
        </button>
      ) : (
        <span className="ab-av ab-av-ph" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </span>
      )}
      <span>
        <b className={isPending(member.name) ? 'pending-txt' : undefined}>{member.name}</b>
        <small className={isPending(member.role) ? 'pending-txt' : undefined}>{role}</small>
      </span>
    </div>
  )
}
