export const MOTION_KEY = 'ufuq-motion'

/** Fired on window whenever the visitor turns motion off or on. */
export const MOTION_EVENT = 'ufuq-motion'

// Runs in <head> before first paint, beside THEME_SCRIPT: a visitor who stopped
// the motion never sees it start. `js` lets CSS hide reveal-ready content only
// when a script will reveal it.
export const MOTION_SCRIPT = `document.documentElement.classList.add('js');try{if(localStorage.getItem('${MOTION_KEY}')==='off')document.documentElement.classList.add('motion-off')}catch(e){}`

export const isMotionOff = () => document.documentElement.classList.contains('motion-off')
