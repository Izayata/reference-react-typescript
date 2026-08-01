import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider } from '../../../../context/ModalMessageContext/ModalMessageContext'
import { ShippingAddress } from './ShippingAddress'
import { AddressModelBuilder } from '../../../../builder/AddressModelBuilder'
import { ZipCodeModel } from '../../../../model/customer/address/ZipCodeModel'
import { CityModel } from '../../../../model/customer/address/CityModel'
import { StreetModel } from '../../../../model/customer/address/StreetModel'
import { StreetNumberModel } from '../../../../model/customer/address/StreetNumberModel'

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
    if (url === '/v1/customer/shipping-address') {
      return Promise.resolve({ ok: true, json: async () => ({}) })
    }
    return Promise.reject(new Error('unexpected fetch url: ' + url))
  }) as unknown as typeof fetch
}

function renderShippingAddress() {
  const address = buildAddress()
  const onAddressUpdated = jest.fn()
  render(
    <MemoryRouter>
      <ModalProvider>
        <ShippingAddress address={address} onAddressUpdated={onAddressUpdated} />
      </ModalProvider>
    </MemoryRouter>
  )
  return { onAddressUpdated }
}

describe('ShippingAddress', () => {
  it('renders view mode with the current address and an Edit button, not the form', () => {
    renderShippingAddress()

    expect(screen.getByText('4028')).toBeInTheDocument()
    expect(screen.getByText('Debrecen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Módosítás' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mentés' })).not.toBeInTheDocument()
  })

  it('enters edit mode and shows the form when the Edit button is clicked', () => {
    renderShippingAddress()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))

    expect(screen.getByRole('button', { name: 'Mentés' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mégse' })).toBeInTheDocument()
  })

  it('returns to view mode when Cancel is clicked', () => {
    renderShippingAddress()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mégse' }))

    expect(screen.getByRole('button', { name: 'Módosítás' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mentés' })).not.toBeInTheDocument()
  })

  it('saves the new address, calls onAddressUpdated, and sends X-CSRF-TOKEN', async () => {
    mockFetch()
    const { onAddressUpdated } = renderShippingAddress()

    fireEvent.click(screen.getByRole('button', { name: 'Módosítás' }))
    fireEvent.change(screen.getByLabelText(/Irányítószám/), { target: { value: '4029' } })
    fireEvent.click(screen.getByRole('button', { name: 'Mentés' }))

    await waitFor(() => expect(onAddressUpdated).toHaveBeenCalledTimes(1), { timeout: 3000 })

    const saveCall = (global.fetch as jest.Mock).mock.calls.find(call => call[0] === '/v1/customer/shipping-address')
    expect(saveCall).toBeDefined()
    expect(saveCall[1].headers['X-CSRF-TOKEN']).toBe('test-token')
  })
})
