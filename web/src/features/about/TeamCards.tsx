'use client'

import { useState } from 'react'
import { isPending } from '@/lib/format'
import { imgAttrs } from '@/lib/media'
import type { TeamMember } from '@/lib/types'

// The sign on a teammate's tile until the photo arrives, in turn.
const SIGNS = ['✦', '</>', '◎']
const SIZES = '(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 240px'

/** «من سيبني نظامك»: grey photos that turn to colour, with the name and role, when pressed. */
export function TeamCards({ team }: { team: TeamMember[] }) {
  let sign = 0
  return (
    <div className="tm-cards">
      {team.map((m, i) => (
        <TeamCard key={i} member={m} sign={m.photo ? null : SIGNS[sign++ % SIGNS.length]} />
      ))}
    </div>
  )
}

function TeamCard({ member, sign }: { member: TeamMember; sign: string | null }) {
  const [on, setOn] = useState(false)
  const role = member.is_founder ? `شريك مؤسس · ${member.role}` : member.role

  return (
    <button type="button" className={`tmc${member.photo ? '' : ' tmc-ph'}${on ? ' on' : ''}`} aria-pressed={on} onClick={() => setOn((o) => !o)}>
      <span className="tmc-img">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- the API already serves the webp widths (see imgAttrs)
          <img {...imgAttrs(member.photo, SIZES)} alt={isPending(member.name) ? '' : member.name} />
        ) : (
          <>
            <span className="tmc-init" aria-hidden="true">
              {sign}
            </span>
            <span className="tmc-soon">الصورة قريباً</span>
          </>
        )}
      </span>
      <span className="tmc-hint" aria-hidden="true">
        اضغط للتعرّف
      </span>
      <span className="tmc-info">
        <b className={isPending(member.name) ? 'pending-txt' : undefined}>{member.name}</b>
        <span className={isPending(member.role) ? 'pending-txt' : undefined}>{role}</span>
        {member.tech && <i className={isPending(member.tech) ? 'pending-txt' : undefined}>{member.tech}</i>}
      </span>
    </button>
  )
}
