import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider } from '../../../../../main/context/ModalMessageContext/ModalMessageContext'
import { BillingAddress } from '../../../../../main/components/page/UserProfile/BillingAddress/BillingAddress'
import { AddressModelBuilder } from '../../../../../main/builder/AddressModelBuilder'
import { ZipCodeModel } from '../../../../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../../../../main/model/customer/address/CityModel'
import { StreetModel } from '../../../../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../../../../main/model/customer/address/StreetNumberModel'

function buildAddress() {
  return new AddressModelBuilder()
    .setZipCode(new ZipCodeModel('4028'))
    .setCity(new CityModel('Debrecen'))
    .setStreet(new StreetModel('Egyetem sgt'))
    .setStreetNumber(new StreetNumberModel('1'))
    .setFloorDoor(null)
    .build()
}

function mockFetch() {
  global.fetch = jest.fn((url: string) => {
    if (url === '/csrf-token') {
      return Promise.resolve({ ok: true, json: async () => ({ csrfToken: 'test-token' }) })
    }
    if (url === '/v1/customer/billing-address') {
      return Promise.resolve({ ok: true, json: async () => ({}) })
    }
    return Promise.reject(new Error('unexpected fetch url: ' + url))
  }) as unknown as typeof fetch
}

function renderBillingAddress() {
  const address = buildAddress()
  const onAddressUpdated = jest.fn()
  render(
    <MemoryRouter>
      <ModalProvider>
        <BillingAddress address={address} onAddressUpdated={onAddressUpdated} />
      </ModalProvider>
    </MemoryRouter>
  )
  return { onAddressUpdated }
}

describe('BillingAddress', () => {
  it('renders view mode with the current address and an Edit button, not the form', () => {
    renderBillingAddress()

    expect(screen.getByText('4028')).toBeInTheDocument()
    expect(screen.getByText('Debrecen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Módosítás' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mentés' })).not.toBeInTheDocument()
  })

  it('enters edit mode and shows the form when the Edit button is clicked', () => {
    renderBillingAddress()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))

    expect(screen.getByRole('button', { name: 'Mentés' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mégse' })).toBeInTheDocument()
  })

  it('returns to view mode when Cancel is clicked', () => {
    renderBillingAddress()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mégse' }))

    expect(screen.getByRole('button', { name: 'Módosítás' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mentés' })).not.toBeInTheDocument()
  })

  it('saves the new address, calls onAddressUpdated, and sends X-CSRF-TOKEN', async () => {
    mockFetch()
    const { onAddressUpdated } = renderBillingAddress()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))
    fireEvent.change(screen.getByLabelText(/Irányítószám/), { target: { value: '4029' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))

    await waitFor(() => expect(onAddressUpdated).toHaveBeenCalledTimes(1), { timeout: 3000 })

    const saveCall = (global.fetch as jest.Mock).mock.calls.find(call => call[0] === '/v1/customer/billing-address')
    expect(saveCall).toBeDefined()
    expect(saveCall[1].headers['X-CSRF-TOKEN']).toBe('test-token')
  })
})
