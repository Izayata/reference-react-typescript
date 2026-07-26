import React from 'react'
import { AddressInput } from '../../../input/customer/address/AddressInput'
import { convertShippingAddressFormDataToFormData } from '../../../../converter/formDataConverter'

interface RegisterFormShippingAddressProps {
  shippingAddressData: {
    shippingZipCode: string
    shippingCity: string
    shippingStreet: string
    shippingStreetNumber: string
    shippingFloorDoor: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const billingFieldMap: Record<string, string> = {
  zip: 'shippingZipCode',
  city: 'shippingCity',
  street: 'shippingStreet',
  streetNumber: 'shippingStreetNumber',
  floorDoor: 'shippingFloorDoor'
}

export const RegisterFormShippingAddress: React.FC<RegisterFormShippingAddressProps> = ({
  shippingAddressData,
  onChange,
}) => {
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const mappedName = billingFieldMap[name] || name
    onChange({ ...e, target: { ...e.target, name: mappedName, value } })
  }

  return (
    <form>
      <AddressInput formData={convertShippingAddressFormDataToFormData(shippingAddressData)} onChange={handleAddressInputChange} />
    </form>
  )
}
