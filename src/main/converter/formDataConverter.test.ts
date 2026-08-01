import {
  convertRegistrationFormDataToBillingAddressFormData,
  convertRegistrationFormDataToShippingAddressFormData,
  convertBillingAddressFormDataToFormData,
  convertShippingAddressFormDataToFormData
} from './formDataConverter'

describe('convertRegistrationFormDataToBillingAddressFormData', () => {
  it('picks only the billing-prefixed fields out of the full registration form data', () => {
    const result = convertRegistrationFormDataToBillingAddressFormData({
      billingZipCode: '4029',
      billingCity: 'Budapest',
      billingStreet: 'Kossuth utca',
      billingStreetNumber: '2',
      billingFloorDoor: '3/A',
    })

    expect(result).toEqual({
      billingZipCode: '4029',
      billingCity: 'Budapest',
      billingStreet: 'Kossuth utca',
      billingStreetNumber: '2',
      billingFloorDoor: '3/A',
    })
  })
})

describe('convertRegistrationFormDataToShippingAddressFormData', () => {
  it('picks only the shipping-prefixed fields out of the full registration form data', () => {
    const result = convertRegistrationFormDataToShippingAddressFormData({
      shippingZipCode: '4028',
      shippingCity: 'Debrecen',
      shippingStreet: 'Egyetem sgt',
      shippingStreetNumber: '1',
      shippingFloorDoor: '',
    })

    expect(result).toEqual({
      shippingZipCode: '4028',
      shippingCity: 'Debrecen',
      shippingStreet: 'Egyetem sgt',
      shippingStreetNumber: '1',
      shippingFloorDoor: '',
    })
  })
})

describe('convertBillingAddressFormDataToFormData', () => {
  it('renames billing-prefixed fields to the generic AddressInput field names', () => {
    const result = convertBillingAddressFormDataToFormData({
      billingZipCode: '4029',
      billingCity: 'Budapest',
      billingStreet: 'Kossuth utca',
      billingStreetNumber: '2',
      billingFloorDoor: '3/A',
    })

    expect(result).toEqual({
      zip: '4029',
      city: 'Budapest',
      street: 'Kossuth utca',
      streetNumber: '2',
      floorDoor: '3/A',
    })
  })
})

describe('convertShippingAddressFormDataToFormData', () => {
  it('renames shipping-prefixed fields to the generic AddressInput field names', () => {
    const result = convertShippingAddressFormDataToFormData({
      shippingZipCode: '4028',
      shippingCity: 'Debrecen',
      shippingStreet: 'Egyetem sgt',
      shippingStreetNumber: '1',
      shippingFloorDoor: '',
    })

    expect(result).toEqual({
      zip: '4028',
      city: 'Debrecen',
      street: 'Egyetem sgt',
      streetNumber: '1',
      floorDoor: '',
    })
  })
})
