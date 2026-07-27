import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider } from '../../../../../main/context/ModalMessageContext/ModalMessageContext'
import { PersonalData } from '../../../../../main/components/page/UserProfile/PersonalData/PersonalData'
import { CustomerModelBuilder } from '../../../../../main/builder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../../../../../main/builder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../../../../../main/builder/AddressModelBuilder'
import { FirstnameModel } from '../../../../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../../../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../../../../main/model/customer/PhoneNumberModel'
import { EmailModel } from '../../../../../main/model/EmailModel'
import { ZipCodeModel } from '../../../../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../../../../main/model/customer/address/CityModel'
import { StreetModel } from '../../../../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../../../../main/model/customer/address/StreetNumberModel'

function buildCustomer() {
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

  return new CustomerModelBuilder()
    .setPersonalDetails(personalDetails)
    .setEmail(new EmailModel('test@example.com'))
    .setShippingAddress(address)
    .setBillingAddress(address)
    .build()
}

function renderPersonalData() {
  const customer = buildCustomer()
  return render(
    <MemoryRouter>
      <ModalProvider>
        <PersonalData customer={customer} />
      </ModalProvider>
    </MemoryRouter>
  )
}

describe('PersonalData', () => {
  it('renders view mode with the current details and an Edit button, not the form', () => {
    renderPersonalData()

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('+36204234442')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Módosítás' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mentés' })).not.toBeInTheDocument()
  })

  it('enters edit mode and shows the form when the Edit button is clicked', () => {
    renderPersonalData()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))

    expect(screen.getByRole('button', { name: 'Mentés' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mégse' })).toBeInTheDocument()
  })

  it('returns to view mode when Cancel is clicked', () => {
    renderPersonalData()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mégse' }))

    expect(screen.getByRole('button', { name: 'Módosítás' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mentés' })).not.toBeInTheDocument()
  })
})
