import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LogoutButton } from './LogoutButton'

describe('LogoutButton', () => {
  it('renders a visible "Kilépés" label', () => {
    render(
      <MemoryRouter>
        <LogoutButton onLogout={jest.fn()} />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: 'Kilépés' })).toBeInTheDocument()
  })
})
