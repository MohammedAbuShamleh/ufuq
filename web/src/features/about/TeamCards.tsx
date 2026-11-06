'use client'

import { useState } from 'react'
import { isPending, isShown } from '@/lib/format'
import { imgAttrs } from '@/lib/media'
import type { TeamMember } from '@/lib/types'

// The sign on a teammate's tile until the photo arrives, in turn.
const SIGNS = ['✦', '</>', '◎']
const FOUNDER_SIZES = '(max-width: 760px) 50vw, 440px'
const TEAM_SIZES = '(max-width: 760px) 33vw, 200px'

/**
 * «من سيبني نظامك»: the founders first, in large portraits framed from the
 * shoulders up, then the rest of the team in a smaller row. Photos are grey
 * and turn to colour, with the name and role, when pressed.
 */
export function TeamCards({ team }: { team: TeamMember[] }) {
  const founders = team.filter((m) => m.is_founder)
  // On the live site a teammate whose name has not arrived yet is left out.
  const rest = team.filter((m) => !m.is_founder && isShown(m.name))
  let sign = 0

  return (
    <>
      {founders.length > 0 && (
        <div className="tm-founders">
          {founders.map((m, i) => (
            <TeamCard key={i} member={m} sign={null} sizes={FOUNDER_SIZES} />
          ))}
        </div>
      )}
      {rest.length > 0 && (
        <>
          <h3 className="tm-team-head">فريق العمل</h3>
          <div className="tm-team">
            {rest.map((m, i) => (
              <TeamCard key={i} member={m} sign={m.photo ? null : SIGNS[sign++ % SIGNS.length]} sizes={TEAM_SIZES} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

function TeamCard({ member, sign, sizes }: { member: TeamMember; sign: string | null; sizes: string }) {
  const [on, setOn] = useState(false)
  // A founder whose role has not arrived yet is still «شريك مؤسس» on the live site.
  const role = member.is_founder ? (isShown(member.role) ? `شريك مؤسس · ${member.role}` : 'شريك مؤسس') : member.role
  const rolePending = isShown(member.role) && isPending(member.role)

  return (
    <button type="button" className={`tmc${member.photo ? '' : ' tmc-ph'}${on ? ' on' : ''}`} aria-pressed={on} onClick={() => setOn((o) => !o)}>
      <span className="tmc-img">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- the API already serves the webp widths (see imgAttrs)
          <img {...imgAttrs(member.photo, sizes)} alt={isPending(member.name) ? '' : member.name} />
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
        <span className={rolePending ? 'pending-txt' : undefined}>{role}</span>
        {member.tech && isShown(member.tech) && <i className={isPending(member.tech) ? 'pending-txt' : undefined}>{member.tech}</i>}
      </span>
    </button>
  )
}
