/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The admin API, e.g. https://api.ufuq.ps/admin/v1 */
  readonly VITE_API_URL?: string
  /** The public site, for «open in the site» links, e.g. https://ufuq.ps */
  readonly VITE_SITE_URL?: string
}
