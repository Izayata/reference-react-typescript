import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider, useModal } from '../../../../main/context/ModalMessageContext/ModalMessageContext'
import { UserProfile } from '../../../../main/components/page/UserProfile/UserProfile'
import { MyUserModelBuilder } from '../../../../main/builder/MyUserModelBuilder'
import { CustomerModelBuilder } from '../../../../main/builder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../../../../main/builder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../../../../main/builder/AddressModelBuilder'
import { FirstnameModel } from '../../../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../../../main/model/customer/PhoneNumberModel'
import { EmailModel } from '../../../../main/model/EmailModel'
import { UsernameModel } from '../../../../main/model/myUser/UsernameModel'
import { ZipCodeModel } from '../../../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../../../main/model/customer/address/CityModel'
import { StreetModel } from '../../../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../../../main/model/customer/address/StreetNumberModel'

function DisplayModalMessage() {
  const { modalMessage } = useModal()
  return <>{modalMessage}</>
}

function buildUserJson() {
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

  const user = new MyUserModelBuilder()
    .setMyUsername(new UsernameModel('testuser'))
    .setEmail(new EmailModel('test@example.com'))
    .setCustomer(customer)
    .build()

  // Round-trip through JSON to mirror what fetch's res.json() actually
  // hands the component: plain deserialized data, not class instances.
  return JSON.parse(JSON.stringify(user))
}

function mockFetch(response: { ok: boolean, json?: () => Promise<unknown> }) {
  global.fetch = jest.fn(() => Promise.resolve(response)) as unknown as typeof fetch
}

function renderUserProfile() {
  render(
    <MemoryRouter>
      <ModalProvider>
        <UserProfile />
        <DisplayModalMessage />
      </ModalProvider>
    </MemoryRouter>
  )
}

describe('UserProfile', () => {
  it('fetches the authenticated user and renders the composed profile sections', async () => {
    mockFetch({ ok: true, json: async () => buildUserJson() })

    renderUserProfile()

    expect(await screen.findByText('testuser', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getAllByText('4028').length).toBeGreaterThan(0)

    expect(global.fetch).toHaveBeenCalledWith('/v1/account/me', { credentials: 'include' })
  })

  it('shows an error modal message when fetching the user fails', async () => {
    mockFetch({ ok: false })

    renderUserProfile()

    expect(await screen.findByText('Felhasználói adatok lekérése sikertelen!', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.queryByText('testuser')).not.toBeInTheDocument()
  })
})
