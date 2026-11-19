import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { indexablePaths, paths } from '@config'
import routes from '@/routes'
import { renderRoute } from '@test/helpers/render-route'

describe('route config', () => {
  // Flatten the route tree into URL paths ('/', '/services', …).
  const configured = routes.flatMap((entry) =>
    entry.children
      ? entry.children.map((child) => (child.index ? '/' : `/${child.path}`))
      : [`/${entry.path}`],
  )

  it('has a route for every path in config', () => {
    for (const path of Object.values(paths)) {
      expect(configured).toContain(path)
    }
  })

  it('serves the sitemap and robots.txt', () => {
    expect(configured).toEqual(expect.arrayContaining(['/sitemap.xml', '/robots.txt']))
  })

  it('only prerenders configured pages', () => {
    for (const path of indexablePaths) {
      expect(configured).toContain(path)
    }
  })
})

describe('routing', () => {
  it.each([
    ['/', 'Every detail, perfected.'],
    ['/services', 'Services'],
    ['/booking', 'Book a detail'],
    ['/contact', 'Contact us'],
    ['/does-not-exist', 'Page not found'],
  ])('renders %s', async (path, heading) => {
    renderRoute(path)
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('navigates from the header to the contact page', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    const mainNav = await screen.findByRole('navigation', { name: 'Main' })
    await user.click(within(mainNav).getByRole('link', { name: 'Contact Us' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Contact us' })).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('/contact')
  })
})
