import React from 'react'
import { AddressInput } from '../../../input/customer/address/AddressInput'
import { convertBillingAddressFormDataToFormData } from '../../../../converter/formDataConverter'

interface RegisterFormBillingAddressProps {
  billingAddressData: {
    billingZipCode: string
    billingCity: string
    billingStreet: string
    billingStreetNumber: string
    billingFloorDoor: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const billingFieldMap: Record<string, string> = {
  zip: 'billingZipCode',
  city: 'billingCity',
  street: 'billingStreet',
  streetNumber: 'billingStreetNumber',
  floorDoor: 'billingFloorDoor'
}

export const RegisterFormBillingAddress: React.FC<RegisterFormBillingAddressProps> = ({
  billingAddressData,
  onChange,
}) => {
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const mappedName = billingFieldMap[name] || name
    onChange({ ...e, target: { ...e.target, name: mappedName, value } })
  }

  return (
    <AddressInput
      formData={convertBillingAddressFormDataToFormData(billingAddressData)}
      onChange={handleAddressInputChange}
    />
  )
}
