import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ModalProvider, useModal } from '../../../../context/ModalMessageContext/ModalMessageContext'
import { LoginData } from './LoginData'
import { MyUserModelBuilder } from '../../../../builder/MyUserModelBuilder'
import { CustomerModelBuilder } from '../../../../builder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../../../../builder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../../../../builder/AddressModelBuilder'
import { FirstnameModel } from '../../../../model/customer/FirstnameModel'
import { LastnameModel } from '../../../../model/customer/LastnameModel'
import { PhoneNumberModel } from '../../../../model/customer/PhoneNumberModel'
import { EmailModel } from '../../../../model/EmailModel'
import { UsernameModel } from '../../../../model/myUser/UsernameModel'
import { ZipCodeModel } from '../../../../model/customer/address/ZipCodeModel'
import { CityModel } from '../../../../model/customer/address/CityModel'
import { StreetModel } from '../../../../model/customer/address/StreetModel'
import { StreetNumberModel } from '../../../../model/customer/address/StreetNumberModel'

function DisplayModalMessage() {
  const { modalMessage } = useModal()
  return <>{modalMessage}</>
}

function buildUser() {
  const personalDetails = new PersonalDetailsModelBuilder()
    .setFirstname(new FirstnameModel('Test'))
    .setLastname(new LastnameModel('User'))
    .setPhoneNumber(new PhoneNumberModel('+36204234442'))
    .build()

  const address = new AddressModelBuilder()
    .setZipCode(new ZipCodeModel('4028'))
    .setCity(new CityModel('Debrecen'))
    .setStreet(new StreetModel('Egyetem sgt'))
    .setStreetNumber(new StreetNumberModel('1'))
    .setFloorDoor(null)
    .build()

  const customer = new CustomerModelBuilder()
    .setPersonalDetails(personalDetails)
    .setEmail(new EmailModel('test@example.com'))
    .setShippingAddress(address)
    .setBillingAddress(address)
    .build()

  return new MyUserModelBuilder()
    .setMyUsername(new UsernameModel('testuser'))
    .setEmail(new EmailModel('test@example.com'))
    .setCustomer(customer)
    .build()
}

function mockFetch(passwordResponse: { ok: boolean, json?: () => Promise<unknown> }) {
  global.fetch = jest.fn((url: string) => {
    if (url === '/csrf-token') {
      return Promise.resolve({ ok: true, json: async () => ({ csrfToken: 'test-token' }) })
    }
    if (url === '/v1/account/password') {
      return Promise.resolve(passwordResponse)
    }
    return Promise.reject(new Error('unexpected fetch url: ' + url))
  }) as unknown as typeof fetch
}

function renderLoginData() {
  const user = buildUser()
  return render(
    <ModalProvider>
      <LoginData user={user} />
      <DisplayModalMessage />
    </ModalProvider>
  )
}

describe('LoginData', () => {
  it('renders view mode with the username/email and a change-password button, not the form', () => {
    renderLoginData()

    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Jelszó Módosítása' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mentés' })).not.toBeInTheDocument()
  })

  it('enters edit mode and shows the password form when the change-password button is clicked', () => {
    renderLoginData()

    fireEvent.click(screen.getByRole('button', { name: 'Jelszó Módosítása' }))

    expect(screen.getByLabelText(/^Jelenlegi jelszó:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Új jelszó:/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Új jelszó megerősítése:/)).toBeInTheDocument()
  })

  it('returns to view mode when Cancel is clicked', () => {
    renderLoginData()

    fireEvent.click(screen.getByRole('button', { name: 'Jelszó Módosítása' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mégse' }))

    expect(screen.getByRole('button', { name: 'Jelszó Módosítása' })).toBeInTheDocument()
    expect(screen.queryByLabelText(/^Jelenlegi jelszó:/)).not.toBeInTheDocument()
  })

  it('submits the password change with X-CSRF-TOKEN and shows the success toast', async () => {
    mockFetch({ ok: true })
    renderLoginData()

    fireEvent.click(screen.getByRole('button', { name: 'Jelszó Módosítása' }))
    fireEvent.change(screen.getByLabelText(/^Jelenlegi jelszó:/), { target: { value: 'OldPass123!', name: 'currentPassword' } })
    fireEvent.change(screen.getByLabelText(/^Új jelszó:/), { target: { value: 'NewPass123!', name: 'newPassword' } })
    fireEvent.change(screen.getByLabelText(/^Új jelszó megerősítése:/), { target: { value: 'NewPass123!', name: 'confirmNewPassword' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))

    await waitFor(() => {
      const call = (global.fetch as jest.Mock).mock.calls.find(c => c[0] === '/v1/account/password')
      expect(call).toBeDefined()
    }, { timeout: 3000 })

    const saveCall = (global.fetch as jest.Mock).mock.calls.find(call => call[0] === '/v1/account/password')
    expect(saveCall[1].headers['X-CSRF-TOKEN']).toBe('test-token')

    await waitFor(() => expect(screen.getByRole('button', { name: 'Jelszó Módosítása' })).toBeInTheDocument(), { timeout: 3000 })
  })

  it('shows the backend error message when the current password does not match', async () => {
    mockFetch({ ok: false, json: async () => ({ message: 'A jelenlegi jelszó helytelen!' }) })
    renderLoginData()

    fireEvent.click(screen.getByRole('button', { name: 'Jelszó Módosítása' }))
    fireEvent.change(screen.getByLabelText(/^Jelenlegi jelszó:/), { target: { value: 'WrongPass123!', name: 'currentPassword' } })
    fireEvent.change(screen.getByLabelText(/^Új jelszó:/), { target: { value: 'NewPass123!', name: 'newPassword' } })
    fireEvent.change(screen.getByLabelText(/^Új jelszó megerősítése:/), { target: { value: 'NewPass123!', name: 'confirmNewPassword' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))

    expect(await screen.findByText('A jelenlegi jelszó helytelen!', {}, { timeout: 3000 })).toBeInTheDocument()
  })
})
