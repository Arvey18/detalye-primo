import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { services } from '@constants'
import { renderRoute } from '@test/helpers/render-route'

describe('ServicesPage', () => {
  it('lists every service', async () => {
    renderRoute('/services')

    for (const service of services) {
      expect(
        await screen.findByRole('heading', { level: 2, name: service.name }),
      ).toBeInTheDocument()
    }
  })

  it('links "Book this" to booking with the service preselected', async () => {
    const user = userEvent.setup()
    renderRoute('/services')

    await user.click(await screen.findByRole('link', { name: 'Book Ceramic Coating' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Book a detail' }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('/booking?service=ceramic')
    expect(await screen.findByRole('combobox', { name: 'Service' })).toHaveTextContent(
      'Ceramic Coating',
    )
  })
})
