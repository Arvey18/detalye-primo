import { describe, expect, it } from 'vitest'
import { bookingPath, paths } from '@config'

describe('bookingPath', () => {
  it('returns the plain booking path without a service', () => {
    expect(bookingPath()).toBe(paths.booking)
  })

  it('adds the service as a query param', () => {
    expect(bookingPath('ceramic')).toBe('/booking?service=ceramic')
  })
})
