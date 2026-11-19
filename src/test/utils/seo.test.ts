import { describe, expect, it } from 'vitest'
import { siteConfig } from '@config'
import { services } from '@constants'
import {
  absoluteUrl,
  buildMeta,
  buildRobots,
  buildSitemap,
  localBusinessJsonLd,
  serviceCatalogJsonLd,
} from '@utils'

const find = (meta: ReturnType<typeof buildMeta>, key: string, value: string) =>
  meta.find((entry) => (entry as Record<string, unknown>)[key] === value) as
    Record<string, string> | undefined

describe('absoluteUrl', () => {
  it('resolves paths against the site origin', () => {
    expect(absoluteUrl('/services')).toBe(`${siteConfig.url}/services`)
  })
})

describe('buildMeta', () => {
  it('builds title, description, canonical and Open Graph tags', () => {
    const meta = buildMeta({ title: 'Services', description: 'Our packages', path: '/services' })

    expect(meta).toContainEqual({ title: 'Services — Detalye Primo' })
    expect(find(meta, 'name', 'description')?.content).toBe('Our packages')
    expect(find(meta, 'property', 'og:title')?.content).toBe('Services — Detalye Primo')
    expect(find(meta, 'property', 'og:url')?.content).toBe(`${siteConfig.url}/services`)
    expect(find(meta, 'rel', 'canonical')?.href).toBe(`${siteConfig.url}/services`)
  })

  it('uses the site title and description on the home page', () => {
    const meta = buildMeta({ path: '/' })
    expect(meta).toContainEqual({ title: 'Detalye Primo — Car Detailing' })
    expect(find(meta, 'name', 'description')?.content).toBe(siteConfig.description)
  })

  it('marks noindex pages and drops their canonical link', () => {
    const meta = buildMeta({ title: 'Page not found', path: '/nope', noIndex: true })
    expect(find(meta, 'name', 'robots')?.content).toBe('noindex')
    expect(find(meta, 'rel', 'canonical')).toBeUndefined()
  })

  it('embeds JSON-LD', () => {
    const data = { '@type': 'Thing' }
    expect(buildMeta({ path: '/', jsonLd: [data] })).toContainEqual({ 'script:ld+json': data })
  })

  it('omits image tags while no share image is configured', () => {
    expect(siteConfig.ogImage).toBeNull()
    expect(find(buildMeta({ path: '/' }), 'property', 'og:image')).toBeUndefined()
  })
})

describe('structured data', () => {
  it('describes the business without empty placeholder fields', () => {
    const business = localBusinessJsonLd() as Record<string, unknown>
    expect(business['@type']).toBe('AutoWash')
    expect(business.name).toBe(siteConfig.name)
    expect(business).not.toHaveProperty('address')
    expect(business).not.toHaveProperty('openingHours')
    expect(business).not.toHaveProperty('image')
  })

  it('lists every service with its starting price', () => {
    const catalog = serviceCatalogJsonLd(services) as { itemListElement: { price: number }[] }
    expect(catalog.itemListElement).toHaveLength(services.length)
    expect(catalog.itemListElement[0].price).toBe(services[0].startingPrice)
  })
})

describe('sitemap and robots', () => {
  it('lists absolute URLs in the sitemap', () => {
    const xml = buildSitemap(['/', '/services'])
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain(`<loc>${siteConfig.url}/</loc>`)
    expect(xml).toContain(`<loc>${siteConfig.url}/services</loc>`)
  })

  it('points robots.txt at the sitemap', () => {
    expect(buildRobots()).toContain(`Sitemap: ${siteConfig.url}/sitemap.xml`)
  })
})
