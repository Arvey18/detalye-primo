/** Single source of truth for URL paths. Use these instead of hard-coded strings. */
export const paths = {
  home: '/',
  services: '/services',
  booking: '/booking',
  contact: '/contact',
} as const

export type AppPath = (typeof paths)[keyof typeof paths]

/** Pages that are prerendered to static HTML and listed in sitemap.xml. */
export const indexablePaths: AppPath[] = [paths.home, paths.services, paths.booking, paths.contact]

/** Booking URL, optionally preselecting a service (e.g. from the Services page). */
export function bookingPath(serviceId?: string): string {
  return serviceId ? `${paths.booking}?service=${encodeURIComponent(serviceId)}` : paths.booking
}
