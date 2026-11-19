import { Outlet, useLocation } from 'react-router'
import { SiteFooter } from '@components/layout/site-footer'
import { SiteHeader } from '@components/layout/site-header'
import { PageTransition } from '@components/motion/page-transition'
import { useSmoothScroll } from '@hooks'

export default function RootLayout() {
  const location = useLocation()
  useSmoothScroll()

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <SiteFooter />
    </div>
  )
}
