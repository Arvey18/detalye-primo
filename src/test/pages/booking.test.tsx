import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@test/helpers/render-route'

describe('BookingPage', () => {
  it('asks for the required fields when submitted empty', async () => {
    const user = userEvent.setup()
    renderRoute('/booking')

    await user.click(await screen.findByRole('button', { name: 'Request booking' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please choose a service, vehicle type, date and time.',
    )
  })

  it('marks the chosen time slot as pressed', async () => {
    const user = userEvent.setup()
    renderRoute('/booking')

    const slot = await screen.findByRole('button', { name: '10:00' })
    await user.click(slot)

    expect(slot).toHaveAttribute('aria-pressed', 'true')
  })
})
