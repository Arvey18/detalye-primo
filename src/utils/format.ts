import { siteConfig } from '@config/site'

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: 'currency',
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}
