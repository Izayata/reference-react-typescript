import { render, screen } from '@testing-library/react'
import { Terms } from './Terms'

describe('Terms', () => {
  it('renders the page title and placeholder content', () => {
    render(<Terms />)

    expect(screen.getByText('Általános Szerződési Feltételek')).toBeInTheDocument()
    expect(screen.getByText('ÁSZF placeholder')).toBeInTheDocument()
  })
})
