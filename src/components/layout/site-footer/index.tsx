import { Link } from 'react-router'
import { siteConfig } from '@config'

const currentYear = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p suppressHydrationWarning>
          © {currentYear} {siteConfig.name}. All rights reserved.
        </p>
        <nav aria-label="Footer" className="flex gap-4">
          {siteConfig.mainNav.slice(1).map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
