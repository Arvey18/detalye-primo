import type { MetaDescriptor } from 'react-router'
import { pageTitle, siteConfig } from '@config'
import type { Service } from '@constants'

/** Resolves a path against the production origin, e.g. '/services' → 'https://…/services'. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString()
}

interface PageMetaOptions {
  /** Page name; omitted for the home page. */
  title?: string
  description?: string
  path: string
  /** Set for pages that shouldn't appear in search results. */
  noIndex?: boolean
  /** schema.org objects to embed as JSON-LD. */
  jsonLd?: object[]
}

/** Title, description, canonical, Open Graph, Twitter card and JSON-LD for a route's `meta` export. */
export function buildMeta({
  title,
  description = siteConfig.description,
  path,
  noIndex = false,
  jsonLd = [],
}: PageMetaOptions): MetaDescriptor[] {
  const fullTitle = pageTitle(title)
  const url = absoluteUrl(path)
  const image = siteConfig.ogImage ? absoluteUrl(siteConfig.ogImage) : null

  const meta: MetaDescriptor[] = [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:locale', content: siteConfig.ogLocale },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ]

  if (noIndex) {
    meta.push({ name: 'robots', content: 'noindex' })
  } else {
    meta.push({ tagName: 'link', rel: 'canonical', href: url })
  }

  if (image) {
    meta.push(
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:image', content: image },
    )
  }

  for (const data of jsonLd) {
    meta.push({ 'script:ld+json': data })
  }

  return meta
}

/** Removes empty strings and empty arrays so placeholder fields don't reach Google. */
function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, v]) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
    ),
  ) as Partial<T>
}

/** schema.org AutoWash (an AutomotiveBusiness) — powers Google's local business results. */
export function localBusinessJsonLd(): object {
  const address = compact({ '@type': 'PostalAddress', ...siteConfig.businessAddress })
  const hasAddress = Object.keys(address).some((key) => !['@type', 'addressCountry'].includes(key))

  return compact({
    '@context': 'https://schema.org',
    '@type': 'AutoWash',
    '@id': `${absoluteUrl('/')}#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl('/'),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: siteConfig.ogImage ? absoluteUrl(siteConfig.ogImage) : '',
    address: hasAddress ? address : '',
    openingHours: siteConfig.openingHours,
    sameAs: siteConfig.sameAs,
    priceRange: '₱₱',
  })
}

/** schema.org OfferCatalog listing each service with its starting price. */
export function serviceCatalogJsonLd(services: Service[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: `${siteConfig.name} services`,
    url: absoluteUrl('/services'),
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      priceCurrency: siteConfig.currency,
      price: service.startingPrice,
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: service.startingPrice,
        priceCurrency: siteConfig.currency,
      },
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        description: service.summary,
        provider: { '@id': `${absoluteUrl('/')}#business` },
      },
    })),
  }
}

/** sitemap.xml body for the given paths. */
export function buildSitemap(paths: string[]): string {
  const urls = paths.map((path) => `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n  </url>`)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

/** robots.txt body: allow everything and point crawlers at the sitemap. */
export function buildRobots(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n')
}
