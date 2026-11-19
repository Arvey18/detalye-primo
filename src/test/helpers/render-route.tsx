import { render } from '@testing-library/react'
import { createRoutesStub, useLocation } from 'react-router'
import RootLayout from '@layouts/root-layout'
import BookingPage from '@pages/booking'
import ContactPage from '@pages/contact'
import HomePage from '@pages/home'
import NotFoundPage from '@pages/not-found'
import ServicesPage from '@pages/services'

/** Renders the current location so tests can assert on navigation. */
function LocationProbe() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname + location.search}</div>
}

function LayoutWithProbe() {
  return (
    <>
      <RootLayout />
      <LocationProbe />
    </>
  )
}

// Mirrors src/routes.ts using the real page modules.
const Stub = createRoutesStub([
  {
    path: '/',
    Component: LayoutWithProbe,
    children: [
      { index: true, Component: HomePage },
      { path: 'services', Component: ServicesPage },
      { path: 'booking', Component: BookingPage },
      { path: 'contact', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
])

/** Renders the full app (layout + pages) at the given path. */
export function renderRoute(path: string) {
  return render(<Stub initialEntries={[path]} />)
}
