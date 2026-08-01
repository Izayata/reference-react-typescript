import { convertRegistrationDataToRegistrationModel } from './RegistrationModelConverter'

const VALID_REGISTRATION_DATA = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'ValidPass123!',
  confirmPassword: 'ValidPass123!',
  firstname: 'Test',
  lastname: 'User',
  phoneNumber: '+36204234442',
  shippingZipCode: '4028',
  shippingCity: 'Debrecen',
  shippingStreet: 'Egyetem sgt',
  shippingStreetNumber: '1',
  shippingFloorDoor: '',
  billingZipCode: '4029',
  billingCity: 'Budapest',
  billingStreet: 'Kossuth utca',
  billingStreetNumber: '2',
  billingFloorDoor: '',
}

describe('convertRegistrationDataToRegistrationModel', () => {
  it('composes the full RegistrationModel from a flat registration form data object', () => {
    const model = convertRegistrationDataToRegistrationModel(VALID_REGISTRATION_DATA)

    expect(model.myUser.myUsername.value).toBe('testuser')
    expect(model.myUser.email.value).toBe('test@example.com')
    expect(model.personalDetails.firstname.value).toBe('Test')
    expect(model.personalDetails.lastname.value).toBe('User')
    expect(model.shippingAddress.city.value).toBe('Debrecen')
    expect(model.billingAddress.city.value).toBe('Budapest')
  })

  it('propagates a validation error from a nested field', () => {
    expect(() => convertRegistrationDataToRegistrationModel({
      ...VALID_REGISTRATION_DATA,
      shippingZipCode: ''
    })).toThrow()
  })
})
