import { render, screen } from '@testing-library/react'
import { SectionHeading } from './SectionHeading'

describe('SectionHeading', () => {
  it('renders the heading with the given class followed by a full-width section divider', () => {
    const { container } = render(<SectionHeading className='custom-title'>Section title</SectionHeading>)

    const heading = screen.getByRole('heading', { level: 3, name: 'Section title' })
    expect(heading).toHaveClass('custom-title')
    expect(screen.getByRole('separator')).toHaveClass('section-divider')
    expect(container.firstChild).toHaveClass('section-heading')
  })
})
