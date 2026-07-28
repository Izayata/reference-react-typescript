import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ModalProvider, useModal } from '../../../../main/context/ModalMessageContext/ModalMessageContext'
import { Checkout } from '../../../../main/components/page/Checkout/Checkout'

function DisplayModalMessage() {
  const { modalMessage } = useModal()
  return <>{modalMessage}</>
}

function renderCheckout(isAuthenticated = false) {
  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <ModalProvider>
        <Routes>
          <Route path="/checkout" element={<Checkout isAuthenticated={isAuthenticated} />} />
          <Route path="/cart" element={<div>Cart page</div>} />
        </Routes>
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

function mockFetch() {
  global.fetch = jest.fn((url: string) => {
    if (url === '/v1/foods/cart') {
      return Promise.resolve({ ok: true, json: async () => [FOOD_ITEM] })
    }
    return Promise.reject(new Error('unexpected fetch url: ' + url))
  }) as unknown as typeof fetch
}

function mockFetchWithOrderSubmission() {
  global.fetch = jest.fn((url: string) => {
    if (url === '/v1/foods/cart') {
      return Promise.resolve({ ok: true, json: async () => [FOOD_ITEM] })
    }
    if (url === '/v1/orders/guest' || url === '/v1/orders') {
      return Promise.resolve({ ok: true, json: async () => ({ id: 1 }) })
    }
    return Promise.reject(new Error('unexpected fetch url: ' + url))
  }) as unknown as typeof fetch
}

describe('Checkout', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects to /cart when the shopping cart is empty', async () => {
    mockFetch()
    renderCheckout()

    expect(await screen.findByText('Cart page', {}, { timeout: 3000 })).toBeInTheDocument()
  })

  it('renders the guest checkout form and order summary once cart items load', async () => {
    localStorage.setItem('shopping_cart', JSON.stringify({ 1: 2 }))
    mockFetch()
    renderCheckout()

    expect(await screen.findByText('Pénztár', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('Személyes adatok')).toBeInTheDocument()
    expect(screen.getByText('Számlázási cím')).toBeInTheDocument()
    expect(screen.getByText(/Gulyásleves/)).toBeInTheDocument()
    expect(screen.getAllByText('3800 Ft')).toHaveLength(2) // item line total + order grand total
    expect(screen.getByText('Készpénz')).toBeInTheDocument()
    expect(screen.getByText('Bankkártya')).toBeInTheDocument()
  })

  it('toggles the cash payment checkbox when clicked', async () => {
    localStorage.setItem('shopping_cart', JSON.stringify({ 1: 1 }))
    mockFetch()
    renderCheckout()

    await screen.findByText('Pénztár', {}, { timeout: 3000 })
    const cashCheckbox = screen.getByLabelText('Készpénz') as HTMLInputElement

    expect(cashCheckbox.checked).toBe(false)
    fireEvent.click(cashCheckbox)
    expect(cashCheckbox.checked).toBe(true)
  })

  it('shows an error when submitting the order without selecting a payment method', async () => {
    // NB: getOrderToSubmit's own catch sets the specific "select a payment method"
    // message, but submitOrder's outer catch then overwrites it with this generic
    // one (both run in the same click) — the specific message is never actually
    // visible to a user. That double-catch behavior is a pre-existing bug this
    // test intentionally documents rather than fixes (out of scope here).
    localStorage.setItem('shopping_cart', JSON.stringify({ 1: 1 }))
    mockFetch()
    renderCheckout()

    await screen.findByText('Pénztár', {}, { timeout: 3000 })
    fireEvent.click(screen.getByText('Megrendel'))

    expect(await screen.findByText('A rendelés adatai hiányosak vagy érvénytelenek!', {}, { timeout: 3000 })).toBeInTheDocument()
  })

  it('does not send a CSRF token when submitting a guest order (CSRF-exempt endpoint)', async () => {
    localStorage.setItem('shopping_cart', JSON.stringify({ 1: 1 }))
    mockFetchWithOrderSubmission()
    renderCheckout(false)

    await screen.findByText('Pénztár', {}, { timeout: 3000 })

    fireEvent.change(screen.getByLabelText(/Keresztnév/), { target: { value: 'Test' } })
    fireEvent.change(screen.getByLabelText(/Vezetéknév/), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/Telefonszám/), { target: { value: '36204234442' } })
    fireEvent.change(screen.getByLabelText(/e-Mail/), { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByLabelText('A számlázási cím megegyezik a szállítási címmel'))
    fireEvent.change(screen.getByLabelText(/Irányítószám/), { target: { value: '4028' } })
    fireEvent.change(screen.getByLabelText(/Város/), { target: { value: 'Debrecen' } })
    fireEvent.change(screen.getByLabelText(/Közterület/), { target: { value: 'Egyetem sgt' } })
    fireEvent.change(screen.getByLabelText(/Házszám/), { target: { value: '1' } })
    fireEvent.click(screen.getByLabelText('Készpénz'))

    fireEvent.click(screen.getByText('Megrendel'))

    await waitFor(() => {
      expect((global.fetch as jest.Mock).mock.calls.some(call => call[0] === '/v1/orders/guest')).toBe(true)
    })

    const orderCall = (global.fetch as jest.Mock).mock.calls.find(call => call[0] === '/v1/orders/guest')
    expect(orderCall[1].headers).not.toHaveProperty('X-CSRF-TOKEN')
  })
})
