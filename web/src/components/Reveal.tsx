'use client'

import { Fragment, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import './reveal.css'

type Props = {
  as?: ElementType
  id?: string
  className?: string
  /** Rise word by word: pass the text, one string per line. */
  words?: string | string[]
  children?: ReactNode
  threshold?: number
}

/**
 * Adds `in` the first time the element scrolls into view; the element's own
 * CSS decides what that reveals. With `words`, a heading rises word by word.
 */
export function Reveal({ as: Tag = 'div', id, className = '', words, children, threshold = 0.35 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { threshold, once: true })
  const cls = [className, words !== undefined && 'rv-h', seen && 'in'].filter(Boolean).join(' ')

  return (
    <Tag ref={ref} id={id} className={cls || undefined}>
      {words !== undefined ? <Words lines={typeof words === 'string' ? [words] : words} /> : children}
    </Tag>
  )
}

function Words({ lines }: { lines: string[] }) {
  let k = 0
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line
        .split(/\s+/)
        .filter(Boolean)
        .map((word, j) => (
          <Fragment key={j}>
            {j > 0 && ' '}
            <span className="rw">
              <span style={{ '--k': k++ } as CSSProperties}>{word}</span>
            </span>
          </Fragment>
        ))}
    </Fragment>
  ))
}
