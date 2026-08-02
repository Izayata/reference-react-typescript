import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider } from '../../../../context/ModalMessageContext/ModalMessageContext'
import { PersonalData } from './PersonalData'
import { CustomerModelBuilder } from '../../../../builder/CustomerModelBuilder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../../../../builder/PersonalDetailsModelBuilder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../../../../builder/AddressModelBuilder/AddressModelBuilder'
import { FirstnameModel } from '../../../../model/customer/FirstnameModel'
import { LastnameModel } from '../../../../model/customer/LastnameModel'
import { PhoneNumberModel } from '../../../../model/customer/PhoneNumberModel'
import { EmailModel } from '../../../../model/EmailModel'
import { ZipCodeModel } from '../../../../model/customer/address/ZipCodeModel'
import { CityModel } from '../../../../model/customer/address/CityModel'
import { StreetModel } from '../../../../model/customer/address/StreetModel'
import { StreetNumberModel } from '../../../../model/customer/address/StreetNumberModel'

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
