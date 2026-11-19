import { indexablePaths } from '@config'
import { buildSitemap } from '@utils'

/** /sitemap.xml — prerendered to a static file at build time. */
export function loader() {
  return new Response(buildSitemap(indexablePaths), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
