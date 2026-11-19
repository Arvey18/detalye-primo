import { buildRobots } from '@utils'

/** /robots.txt — prerendered to a static file at build time. */
export function loader() {
  return new Response(buildRobots(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
