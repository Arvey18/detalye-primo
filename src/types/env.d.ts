/// <reference types="vite/client" />

// Typed environment variables. Every VITE_* variable is embedded in the
// browser bundle — never put secrets here.
interface ImportMetaEnv {
  /** Production origin, e.g. https://detalyeprimo.com (no trailing slash needed). */
  readonly VITE_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
