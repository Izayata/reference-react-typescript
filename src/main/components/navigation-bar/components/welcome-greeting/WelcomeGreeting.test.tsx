import { render, screen } from '@testing-library/react'
import { WelcomeGreeting } from './WelcomeGreeting'

describe('WelcomeGreeting', () => {
  it('renders the interpolated greeting with the given username', () => {
    render(<WelcomeGreeting username='testUser4' />)

    expect(screen.getByText('Üdvözöljük, testUser4!')).toBeInTheDocument()
  })
})
