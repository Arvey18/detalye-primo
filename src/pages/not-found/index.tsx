import { Link, type MetaFunction } from 'react-router'
import { Button } from '@components/ui/button'
import { paths } from '@config'
import { buildMeta } from '@utils'

export const meta: MetaFunction = ({ location }) =>
  buildMeta({ title: 'Page not found', path: location.pathname, noIndex: true })

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild>
        <Link to={paths.home}>Back to home</Link>
      </Button>
    </section>
  )
}
