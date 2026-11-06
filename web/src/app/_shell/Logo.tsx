import { useId } from 'react'

// Generated from public/brand/ufuq-logo-horizontal.svg. Colors come from the
// --mark-* tokens so the logo follows light and dark mode. The Latin «UFUQ»
// under the Arabic word is left out: at nav and footer size it was a couple of
// pixels tall and could not be read (the label still names it).
const ARCH = 'M42 236 L42 124 A108 108 0 0 1 128 18.26 A108 108 0 0 1 214 124 L214 236 Z M56 236 L56 124 A94 94 0 0 1 128 32.61 A94 94 0 0 1 200 124 L200 236 Z M103.52 236 L68 236 L68 124 A82 82 0 0 1 128 45.01 A82 82 0 0 1 188 124 L188 236 L152.48 236 L132 159.55 A18 18 0 1 0 124 159.55 Z'
const WORD_AR = 'M0 96.65ZM98.57 96.65H85.49V100.69Q85.49 107.5 82.41 113.24Q79.32 118.98 72.99 122.49Q66.67 126 57.42 126H27.54Q18.18 126 12.02 122.49Q5.85 118.98 2.92 113.19Q0 107.39 0 100.48Q0 91.66 4.36 67.2L17.65 69.43L16.91 74.43Q15.42 83.79 14.62 89.64Q13.82 95.48 13.82 98.99Q13.82 105.16 16.96 109.09Q20.1 113.03 27.54 113.03H57.42Q64.75 113.03 68 109.09Q71.24 105.16 71.24 99.21V96.65H58.06Q49.66 96.65 45.08 94.9Q40.51 93.14 38.28 87.83Q36.05 82.51 36.05 71.67Q36.05 60.08 38.76 54.07Q41.47 48.06 47.42 45.83Q53.38 43.59 64.33 43.59Q73.05 43.59 79.96 44.34L85.49 44.98V83.68H98.57ZM61.56 83.68H71.24V56.78Q68.05 56.57 64.75 56.57Q59.12 56.57 56.09 57.74Q53.06 58.91 51.68 62.1Q50.29 65.29 50.29 71.45Q50.29 77.19 51.41 79.8Q52.53 82.41 54.76 83.04Q56.99 83.68 61.56 83.68ZM52.53 20.31H63.48V33.6H52.53ZM68.69 20.31H79.64V33.6H68.69ZM98.57 96.65ZM157.79 44.98V96.65H98.57V83.68H109.94Q108.14 77.19 108.14 69.01Q108.14 59.33 111.17 53.8Q114.2 48.27 120.36 45.93Q126.53 43.59 136.63 43.59Q145.56 43.59 152.26 44.34ZM124.62 83.68H143.54V56.57Q138.87 56.25 136.21 56.25Q130.47 56.25 127.65 57.52Q124.83 58.8 123.71 61.99Q122.6 65.18 122.6 71.67Q122.6 75.71 123.13 78.21Q123.66 80.7 124.62 83.68ZM127.49 19.78H140.57V33.6H127.49ZM165.98 96.65ZM171.62 31.37H185.86V96.65H171.62ZM190.44 21.05 167.15 25.63 165.98 20.63 170.87 19.35Q166.72 15.84 166.72 10.74Q166.72 6.38 169.86 3.19Q173 0 177.89 0Q182.04 0 186.18 2.55L184.8 8.93Q184.16 8.4 182.99 7.92Q181.82 7.44 180.33 7.44Q177.89 7.44 176.35 9.04Q174.81 10.63 174.81 12.87Q174.81 15.84 177.36 17.65L188.95 14.57Z'

type LogoProps = {
  className?: string
  label?: string
}

export function Logo({ className, label = 'أفق UFUQ' }: LogoProps) {
  // Unique clip ids: the logo appears more than once per page (nav and footer).
  const id = useId()
  const left = `${id}left`
  const right = `${id}right`

  return (
    <svg viewBox="20 10 560 275" role="img" aria-label={label} className={className}>
      <g transform="translate(20 16)">
        <g transform="translate(12.8 0) scale(.9 1)">
          <defs>
            <clipPath id={left}>
              <rect x="0" y="0" width="128" height="256" />
            </clipPath>
            <clipPath id={right}>
              <rect x="128" y="0" width="128" height="256" />
            </clipPath>
          </defs>
          <path clipPath={`url(#${left})`} className="fill-mark-a" fillRule="evenodd" d={ARCH} />
          <path clipPath={`url(#${right})`} className="fill-mark-b" fillRule="evenodd" d={ARCH} />
        </g>
      </g>
      <g transform="translate(315 55) scale(1.25)" className="fill-mark-w">
        <path transform="translate(0 24.825)" fillRule="evenodd" d={WORD_AR} />
      </g>
    </svg>
  )
}
