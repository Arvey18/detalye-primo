import type { Config } from '@react-router/dev/config'
import { indexablePaths } from './src/config/routes.ts'

export default {
  appDirectory: 'src',
  // Static site: no server at runtime. Every indexable page is rendered to real
  // HTML at build time so search engines and social link previews see full
  // content. Unknown URLs fall back to the client-rendered app (and its 404 page).
  ssr: false,
  prerender: [...indexablePaths, '/sitemap.xml', '/robots.txt'],
} satisfies Config
