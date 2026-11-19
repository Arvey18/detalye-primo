import { env } from './env'
import { paths } from './routes'

// ⚠️ Placeholder business details — replace before launch. These feed the page
// meta tags, social previews and Google structured data, so they must be real.
export const siteConfig = {
  name: 'Detalye Primo',
  tagline: 'Car Detailing',
  description:
    'Premium car detailing — interior, exterior, paint correction and ceramic coating. Book online.',
  /** Production origin (from VITE_SITE_URL). Used for canonical URLs and the sitemap. */
  url: env.siteUrl,
  locale: 'en-PH',
  /** Open Graph locale format. */
  ogLocale: 'en_PH',
  currency: 'PHP',
  /**
   * Social share image (1200×630 JPG/PNG in /public), e.g. '/og-image.jpg'.
   * Leave null until a real image exists — a broken image is worse than none.
   */
  ogImage: null as string | null,
  contact: {
    phone: '+63 900 000 0000',
    email: 'hello@detalyeprimo.com',
    address: 'Address to follow',
  },
  /** Structured address for Google. Empty fields are left out of the markup. */
  businessAddress: {
    streetAddress: '',
    addressLocality: '',
    addressRegion: '',
    postalCode: '',
    addressCountry: 'PH',
  },
  /** schema.org openingHours format, e.g. 'Mo-Sa 08:00-18:00'. */
  openingHours: [] as string[],
  /** Social profile URLs (Facebook, Instagram, TikTok…). */
  sameAs: [] as string[],
  mainNav: [
    { to: paths.home, label: 'Home' },
    { to: paths.services, label: 'Services' },
    { to: paths.booking, label: 'Booking' },
    { to: paths.contact, label: 'Contact Us' },
  ],
}

/** Builds a document title like "Services — Detalye Primo". */
export function pageTitle(page?: string): string {
  return page ? `${page} — ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`
}
