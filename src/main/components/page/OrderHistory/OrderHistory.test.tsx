import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ModalProvider, useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { OrderHistory } from './OrderHistory'

const VALID_RAW_ORDER = {
  id: 1,
  orderItems: [
    {
      food: { id: 1, foodName: { value: 'Gulyásleves' } },
      quantity: 2,
      orderItemPrice: 3800
    }
  ],
  totalCost: 3800,
  totalCostCurrency: 'HUF',
  paymentType: 'CASH',
  createdAt: '2026-07-14T18:32:00Z'
}

function DisplayModalMessage() {
  const { modalMessage } = useModal()
  return <>{modalMessage}</>
}

function mockFetch(response: { ok: boolean, json?: () => Promise<unknown> }) {
  global.fetch = jest.fn(() => Promise.resolve(response)) as unknown as typeof fetch
}

function renderOrderHistory() {
  render(
    <MemoryRouter initialEntries={['/orders']}>
      <ModalProvider>
        <Routes>
          <Route path='/orders' element={<OrderHistory />} />
          <Route path='/cart' element={<div>CART_PAGE_MARKER</div>} />
        </Routes>
        <DisplayModalMessage />
      </ModalProvider>
    </MemoryRouter>
  )
}

describe('OrderHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the empty state when there are no past orders', async () => {
    mockFetch({ ok: true, json: async () => [] })

    renderOrderHistory()

    expect(await screen.findByText('Még nem adott le rendelést.', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(global.fetch).toHaveBeenCalledWith('/v1/orders', { credentials: 'include' })
  })

  it('renders a fetched order\'s date, items, and total', async () => {
    mockFetch({ ok: true, json: async () => [VALID_RAW_ORDER] })

    renderOrderHistory()

    expect(await screen.findByText('Gulyásleves × 2', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('3800 HUF')).toBeInTheDocument()
  })

  it('shows an error modal message when fetching order history fails', async () => {
    mockFetch({ ok: false })

    renderOrderHistory()

    expect(await screen.findByText(
      'Korábbi rendelések lekérése sikertelen! Győződjön meg, hogy be van jelentkezve!',
      {},
      { timeout: 3000 }
    )).toBeInTheDocument()
  })

  it('still renders the valid orders when one order fails to convert', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    const INVALID_RAW_ORDER = {
      ...VALID_RAW_ORDER,
      id: 99,
      orderItems: [
        { food: { id: 1, foodName: { value: '@Invalid' } }, quantity: 1, orderItemPrice: 1000 }
      ]
    }
    mockFetch({ ok: true, json: async () => [VALID_RAW_ORDER, INVALID_RAW_ORDER] })

    renderOrderHistory()

    expect(await screen.findByText('Gulyásleves × 2', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.queryByText('@Invalid × 1')).not.toBeInTheDocument()
    warnSpy.mockRestore()
  })

  it('reordering adds the order\'s items to the cart and navigates to /cart', async () => {
    mockFetch({ ok: true, json: async () => [VALID_RAW_ORDER] })

    renderOrderHistory()

    const reorderButton = await screen.findByRole('button', { name: 'Rendelés újra' }, { timeout: 3000 })
    fireEvent.click(reorderButton)

    expect(JSON.parse(localStorage.getItem('shopping_cart') || '{}')).toEqual({ 1: 2 })
    expect(await screen.findByText('CART_PAGE_MARKER')).toBeInTheDocument()
  })
})
