import {
  convertRegistrationDataToPersonalDetailsModel,
  convertPersonalDetailsFormDataToPersonalDetailsModel
} from './PersonalDetailsConverter'
import { ERR_MSG_FIRSTNAME_VALUE_REQUIRED } from '../utils/customer/FirstnameUtils'

const VALID_DATA = {
  firstname: 'Test',
  lastname: 'User',
  phoneNumber: '+36204234442',
}

describe('convertRegistrationDataToPersonalDetailsModel', () => {
  it('maps firstname, lastname, and phoneNumber onto the model', () => {
    const model = convertRegistrationDataToPersonalDetailsModel(VALID_DATA)

    expect(model.firstname.value).toBe('Test')
    expect(model.lastname.value).toBe('User')
    expect(model.phoneNumber.value).toBe('+36204234442')
  })

  it('propagates the underlying model validation error for an invalid field', () => {
    try {
      convertRegistrationDataToPersonalDetailsModel({ ...VALID_DATA, firstname: '' })
      throw new Error('Expected error was not thrown')
    } catch (errors) {
      const messages = Array.isArray(errors)
        ? errors.flatMap((err: any) => err.constraints ? Object.values(err.constraints) : [])
        : []
      expect(messages).toContain(ERR_MSG_FIRSTNAME_VALUE_REQUIRED)
    }
  })
})

describe('convertPersonalDetailsFormDataToPersonalDetailsModel', () => {
  it('maps firstname, lastname, and phoneNumber onto the model', () => {
    const model = convertPersonalDetailsFormDataToPersonalDetailsModel(VALID_DATA)

    expect(model.firstname.value).toBe('Test')
    expect(model.lastname.value).toBe('User')
    expect(model.phoneNumber.value).toBe('+36204234442')
  })
})
