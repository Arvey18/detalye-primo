import { describe, expect, it } from 'vitest'
import { formatDuration, formatPrice } from '@utils'

describe('formatDuration', () => {
  it('formats minutes and hours', () => {
    expect(formatDuration(45)).toBe('45 min')
    expect(formatDuration(120)).toBe('2 hr')
    expect(formatDuration(150)).toBe('2 hr 30 min')
  })
})

describe('formatPrice', () => {
  it('formats whole amounts in the site currency', () => {
    expect(formatPrice(1500)).toMatch(/1,500/)
    expect(formatPrice(1500)).not.toMatch(/\.00/)
  })
})
