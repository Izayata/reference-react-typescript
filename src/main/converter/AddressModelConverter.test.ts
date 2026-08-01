import {
  convertRegistrationFormDataToShippingAddressModel,
  convertRegistrationFormDataToBillingAddressModel,
  convertBillingAddressFormToAddressModel,
  convertShippingAddressFormToAddressModel
} from './AddressModelConverter'
import { ERR_MSG_ZIP_CODE_VALUE_REQUIRED } from '../utils/customer/address/ZipCodeUtils'

const VALID_REGISTRATION_FORM_DATA = {
  shippingZipCode: '4028',
  shippingCity: 'Debrecen',
  shippingStreet: 'Egyetem sgt',
  shippingStreetNumber: '1',
  shippingFloorDoor: '',
  billingZipCode: '4029',
  billingCity: 'Budapest',
  billingStreet: 'Kossuth utca',
  billingStreetNumber: '2',
  billingFloorDoor: '3/A',
}

const VALID_BILLING_ADDRESS_FORM_DATA = {
  billingZipCode: '4029',
  billingCity: 'Budapest',
  billingStreet: 'Kossuth utca',
  billingStreetNumber: '2',
  billingFloorDoor: '3/A',
}

const VALID_SHIPPING_ADDRESS_FORM_DATA = {
  shippingZipCode: '4028',
  shippingCity: 'Debrecen',
  shippingStreet: 'Egyetem sgt',
  shippingStreetNumber: '1',
  shippingFloorDoor: '',
}

describe('AddressModelConverter', () => {
  describe('convertRegistrationFormDataToShippingAddressModel', () => {
    it('maps the shipping fields of the registration form data onto the model', () => {
      const address = convertRegistrationFormDataToShippingAddressModel(VALID_REGISTRATION_FORM_DATA)

      expect(address.zipCode.value).toBe('4028')
      expect(address.city.value).toBe('Debrecen')
      expect(address.street.value).toBe('Egyetem sgt')
      expect(address.streetNumber.value).toBe('1')
      expect(address.floorDoor).toBeNull()
    })

    it('sets floorDoor to a real model when provided', () => {
      const address = convertRegistrationFormDataToShippingAddressModel({
        ...VALID_REGISTRATION_FORM_DATA,
        shippingFloorDoor: '3/A'
      })

      expect(address.floorDoor?.value).toBe('3/A')
    })

    it('propagates the underlying model validation error for an invalid field', () => {
      expect(() => convertRegistrationFormDataToShippingAddressModel({
        ...VALID_REGISTRATION_FORM_DATA,
        shippingZipCode: ''
      })).toThrow()
    })
  })

  describe('convertRegistrationFormDataToBillingAddressModel', () => {
    it('maps the billing fields of the registration form data onto the model', () => {
      const address = convertRegistrationFormDataToBillingAddressModel(VALID_REGISTRATION_FORM_DATA)

      expect(address.zipCode.value).toBe('4029')
      expect(address.city.value).toBe('Budapest')
      expect(address.street.value).toBe('Kossuth utca')
      expect(address.streetNumber.value).toBe('2')
      expect(address.floorDoor?.value).toBe('3/A')
    })
  })

  describe('convertBillingAddressFormToAddressModel', () => {
    it('maps a standalone billing address form onto the model', () => {
      const address = convertBillingAddressFormToAddressModel(VALID_BILLING_ADDRESS_FORM_DATA)

      expect(address.zipCode.value).toBe('4029')
      expect(address.city.value).toBe('Budapest')
      expect(address.street.value).toBe('Kossuth utca')
      expect(address.streetNumber.value).toBe('2')
      expect(address.floorDoor?.value).toBe('3/A')
    })

    it('throws with the model validation error message when a field is invalid', () => {
      try {
        convertBillingAddressFormToAddressModel({ ...VALID_BILLING_ADDRESS_FORM_DATA, billingZipCode: '' })
        throw new Error('Expected error was not thrown')
      } catch (errors) {
        const messages = Array.isArray(errors)
          ? errors.flatMap((err: any) => err.constraints ? Object.values(err.constraints) : [])
          : []
        expect(messages).toContain(ERR_MSG_ZIP_CODE_VALUE_REQUIRED)
      }
    })
  })

  describe('convertShippingAddressFormToAddressModel', () => {
    it('maps a standalone shipping address form onto the model', () => {
      const address = convertShippingAddressFormToAddressModel(VALID_SHIPPING_ADDRESS_FORM_DATA)

      expect(address.zipCode.value).toBe('4028')
      expect(address.city.value).toBe('Debrecen')
      expect(address.street.value).toBe('Egyetem sgt')
      expect(address.streetNumber.value).toBe('1')
      expect(address.floorDoor).toBeNull()
    })
  })
})
