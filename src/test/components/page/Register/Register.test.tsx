import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider, useModal } from '../../../../main/context/ModalMessageContext/ModalMessageContext'
import { Register } from '../../../../main/components/page/Register/Register'

function DisplayModalMessage() {
  const { modalMessage } = useModal()
  return <>{modalMessage}</>
}

function renderRegister() {
  return render(
    <MemoryRouter>
      <ModalProvider>
        <Register />
        <DisplayModalMessage />
      </ModalProvider>
    </MemoryRouter>
  )
}

function mockExistenceFetch({ usernameExists, emailExists }: { usernameExists: boolean, emailExists: boolean }) {
  global.fetch = jest.fn((url: string) => {
    if (url.startsWith('/v1/registration/username/')) {
      return Promise.resolve({ ok: true, json: async () => ({ exists: usernameExists }) })
    }
    if (url.startsWith('/v1/registration/email/')) {
      return Promise.resolve({ ok: true, json: async () => ({ exists: emailExists }) })
    }
    return Promise.reject(new Error('unexpected fetch url: ' + url))
  }) as unknown as typeof fetch
}

function fillUserDetailsStep() {
  fireEvent.change(screen.getByRole('textbox', { name: /Felhasználónév/ }), { target: { value: 'ValidUser123', name: 'username' } })
  fireEvent.change(screen.getByLabelText('Jelszó:*'), { target: { value: 'ValidPass123!', name: 'password' } })
  fireEvent.change(screen.getByLabelText(/Jelszó újra/), { target: { value: 'ValidPass123!', name: 'confirmPassword' } })
  fireEvent.change(screen.getByRole('textbox', { name: /e-Mail/ }), { target: { value: 'test@example.com', name: 'email' } })
}

describe('Register', () => {
  it('renders the first step (user details) by default', () => {
    mockExistenceFetch({ usernameExists: false, emailExists: false })
    renderRegister()

    expect(screen.getByRole('textbox', { name: /Felhasználónév/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tovább' })).toBeInTheDocument()
  })

  it('advances to the personal details step when user details are valid and available', async () => {
    mockExistenceFetch({ usernameExists: false, emailExists: false })
    renderRegister()

    fillUserDetailsStep()
    fireEvent.click(screen.getByRole('button', { name: 'Tovább' }))

    expect(await screen.findByText('Keresztnév:')).toBeInTheDocument()
  })

  it('shows an error and stays on step 1 when the username is already taken', async () => {
    mockExistenceFetch({ usernameExists: true, emailExists: false })
    renderRegister()

    fillUserDetailsStep()
    fireEvent.click(screen.getByRole('button', { name: 'Tovább' }))

    expect(await screen.findByText('A megadott felhasználónév foglalt!')).toBeInTheDocument()
    expect(screen.queryByText('Keresztnév:')).not.toBeInTheDocument()
  })

  it('shows an error and stays on step 1 when the email is already taken', async () => {
    mockExistenceFetch({ usernameExists: false, emailExists: true })
    renderRegister()

    fillUserDetailsStep()
    fireEvent.click(screen.getByRole('button', { name: 'Tovább' }))

    expect(await screen.findByText('A megadott email cím foglalt!')).toBeInTheDocument()
    expect(screen.queryByText('Keresztnév:')).not.toBeInTheDocument()
  })

  it('shows a validation error and does not advance when a required field is left blank', async () => {
    mockExistenceFetch({ usernameExists: false, emailExists: false })
    renderRegister()

    fireEvent.change(screen.getByRole('textbox', { name: /Felhasználónév/ }), { target: { value: 'ValidUser123', name: 'username' } })
    fireEvent.click(screen.getByRole('button', { name: 'Tovább' }))

    expect(await screen.findByRole('button', { name: 'Tovább' })).toBeInTheDocument()
    expect(screen.queryByText('Keresztnév:')).not.toBeInTheDocument()
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
