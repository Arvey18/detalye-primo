import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '@test/helpers/render-route'

describe('ContactPage', () => {
  it('shows a confirmation after sending a message', async () => {
    const user = userEvent.setup()
    renderRoute('/contact')

    await user.type(await screen.findByLabelText('Name'), 'Juan')
    await user.type(screen.getByLabelText('Email'), 'juan@example.com')
    await user.type(screen.getByLabelText('Message'), 'How long does ceramic coating take?')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Your message has been sent')
  })
})
