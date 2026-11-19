import { Link, NavLink } from 'react-router'
import LogoMark from '@assets/svg/logo-mark.svg?react'
import { Button } from '@components/ui/button'
import { paths, siteConfig } from '@config'
import { cn } from '@utils'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          to={paths.home}
          className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight"
        >
          <LogoMark className="size-6" aria-hidden />
          {siteConfig.name}
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-4">
          {siteConfig.mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'hidden rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block',
                  isActive && 'text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Button asChild size="sm">
            <Link to={paths.booking}>Book now</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
