import { describe, expect, it } from 'vitest'
import { getService, services } from '@constants'

describe('services catalog', () => {
  it('has unique ids', () => {
    const ids = services.map((service) => service.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('lists what each service includes', () => {
    for (const service of services) {
      expect(service.includes.length).toBeGreaterThan(0)
    }
  })

  it('looks up a service by id', () => {
    expect(getService('ceramic')?.name).toBe('Ceramic Coating')
    expect(getService('nope')).toBeUndefined()
    expect(getService(null)).toBeUndefined()
  })
})
