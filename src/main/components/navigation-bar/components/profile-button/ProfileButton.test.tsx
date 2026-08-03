import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProfileButton } from './ProfileButton'

describe('ProfileButton', () => {
  it('renders an icon-only link to /account by default', () => {
    render(
      <MemoryRouter>
        <ProfileButton />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Fiók megnyitása' })
    expect(link).toHaveAttribute('href', '/account')
  })

  it('renders the "Profilom" label when asText is set', () => {
    render(
      <MemoryRouter>
        <ProfileButton asText />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Profilom' })
    expect(link).toHaveAttribute('href', '/account')
  })
})
