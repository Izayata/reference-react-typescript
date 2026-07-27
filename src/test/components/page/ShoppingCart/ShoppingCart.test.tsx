import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider, useModal } from '../../../../main/context/ModalMessageContext/ModalMessageContext'
import { ShoppingCart } from '../../../../main/components/page/ShoppingCart/ShoppingCart'

function DisplayModalMessage() {
  const { modalMessage } = useModal()
  return <>{modalMessage}</>
}

function renderShoppingCart() {
  return render(
    <MemoryRouter>
      <ModalProvider>
        <ShoppingCart />
        <DisplayModalMessage />
      </ModalProvider>
    </MemoryRouter>
  )
}

const FOOD_ITEM = {
  foodId: 1,
  foodName: { value: 'Gulyásleves' },
  price: { amount: '1900', currency: 'HUF' },
  imageUrl: { value: 'https://example.com/image.jpg' }
}

describe('ShoppingCart', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the empty-cart message when there is nothing in localStorage', async () => {
    global.fetch = jest.fn()
    renderShoppingCart()

    expect(await screen.findByText('A kosár üres.', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('fetches and renders cart contents when items are stored', async () => {
    localStorage.setItem('shopping_cart', JSON.stringify({ 1: 2 }))
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [FOOD_ITEM] })
    renderShoppingCart()

    expect(await screen.findByText('Gulyásleves', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('Kosár')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pénztár' })).toHaveAttribute('href', '/checkout')
    expect(global.fetch).toHaveBeenCalledWith('/v1/foods/cart', expect.objectContaining({ method: 'POST' }))
  })

  it('shows an error message when fetching cart contents fails', async () => {
    localStorage.setItem('shopping_cart', JSON.stringify({ 1: 1 }))
    global.fetch = jest.fn().mockResolvedValue({ ok: false })
    renderShoppingCart()

    expect(await screen.findByText('Failed to fetch food details', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(await screen.findByText('A kosár üres.', {}, { timeout: 3000 })).toBeInTheDocument()
  })
})
