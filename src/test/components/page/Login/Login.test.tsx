import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider, useModal } from '../../../../main/context/ModalMessageContext/ModalMessageContext'
import { Login } from '../../../../main/components/page/Login/Login'

function DisplayModalMessage() {
  const { modalMessage } = useModal()
  return <>{modalMessage}</>
}

function renderLogin(onLogin: () => void) {
  return render(
    <MemoryRouter>
      <ModalProvider>
        <Login onLogin={onLogin} />
        <DisplayModalMessage />
      </ModalProvider>
    </MemoryRouter>
  )
}

function mockFetch(loginResponse: { ok: boolean, status?: number, json?: () => Promise<unknown>, text?: () => Promise<unknown> }) {
  global.fetch = jest.fn((url: string) => {
    if (url === '/csrf-token') {
      return Promise.resolve({ ok: true, json: async () => ({ csrfToken: 'test-token' }) })
    }
    if (url === '/login') {
      return Promise.resolve(loginResponse)
    }
    return Promise.reject(new Error('unexpected fetch url: ' + url))
  }) as unknown as typeof fetch
}

describe('Login', () => {
  const originalLocation = window.location

  beforeEach(() => {
    delete (window as unknown as { location?: Location }).location
    window.location = { ...originalLocation, href: '' } as unknown as Location
  })

  afterAll(() => {
    window.location = originalLocation
  })

  it('submits the username and password and logs in on success', async () => {
    mockFetch({ ok: true, json: async () => ({ redirectUrl: '/menu' }) })
    const onLogin = jest.fn()
    renderLogin(onLogin)

    fireEvent.change(screen.getByLabelText(/Felhasználónév/), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/Jelszó/), { target: { value: 'testpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Bejelentkezés' }))

    await waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1))
    expect(window.location.href).toBe('/menu')

    const loginCall = (global.fetch as jest.Mock).mock.calls.find(call => call[0] === '/login')
    expect(loginCall[1].body).toContain('username=testuser')
    expect(loginCall[1].body).toContain('password=testpass')
  })

  it('shows an error message and does not call onLogin when credentials are rejected', async () => {
    mockFetch({ ok: false, status: 401, text: async () => 'Unauthorized' })
    const onLogin = jest.fn()
    renderLogin(onLogin)

    fireEvent.change(screen.getByLabelText(/Felhasználónév/), { target: { value: 'baduser' } })
    fireEvent.change(screen.getByLabelText(/Jelszó/), { target: { value: 'badpass' } })
    fireEvent.click(screen.getByRole('button', { name: 'Bejelentkezés' }))

    expect(await screen.findByText('Hibás felhasználónév vagy jelszó.')).toBeInTheDocument()
    expect(onLogin).not.toHaveBeenCalled()
  })

  it('links to the forgotten-password and registration pages', () => {
    mockFetch({ ok: true, json: async () => ({}) })
    renderLogin(jest.fn())

    expect(screen.getByRole('link', { name: 'Elfelejtette jelszavát?' })).toHaveAttribute('href', '/forgot-password')
    expect(screen.getByRole('link', { name: 'Regisztráljon itt!' })).toHaveAttribute('href', '/register')
  })
})
