import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { OrdersButton } from './OrdersButton'

describe('OrdersButton', () => {
  it('renders a link to /orders with a visible label', () => {
    render(
      <MemoryRouter>
        <OrdersButton />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', { name: 'Rendeléseim' })
    expect(link).toHaveAttribute('href', '/orders')
  })
})
