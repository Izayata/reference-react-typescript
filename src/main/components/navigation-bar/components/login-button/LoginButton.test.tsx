import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginButton } from './LoginButton'

describe('LoginButton', () => {
  it('renders a link to /login with a visible label', () => {
    render(
      <MemoryRouter>
        <LoginButton />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Belépés' })
    expect(link).toHaveAttribute('href', '/login')
  })
})
