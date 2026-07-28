import { convertRegistrationDataToMyUserRegistrationModel } from '../../main/converter/MyUserRegistrationModelConverter'
import { ERR_MSG_USERNAME_VALUE_REQUIRED } from '../../main/utils/myUser/UsernameUtils'

const VALID_REGISTRATION_DATA = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'ValidPass123!',
  confirmPassword: 'ValidPass123!',
}

describe('convertRegistrationDataToMyUserRegistrationModel', () => {
  it('maps username, email, and password fields onto the model', () => {
    const model = convertRegistrationDataToMyUserRegistrationModel(VALID_REGISTRATION_DATA)

    expect(model.myUsername.value).toBe('testuser')
    expect(model.email.value).toBe('test@example.com')
    expect(model.newPasswordDetails.newPassword.value).toBe('ValidPass123!')
    expect(model.newPasswordDetails.confirmNewPassword.value).toBe('ValidPass123!')
  })

  it('propagates the underlying model validation error for an invalid field', () => {
    try {
      convertRegistrationDataToMyUserRegistrationModel({ ...VALID_REGISTRATION_DATA, username: '' })
      throw new Error('Expected error was not thrown')
    } catch (errors) {
      const messages = Array.isArray(errors)
        ? errors.flatMap((err: any) => err.constraints ? Object.values(err.constraints) : [])
        : []
      expect(messages).toContain(ERR_MSG_USERNAME_VALUE_REQUIRED)
    }
  })

  it('propagates the password-mismatch validation error', () => {
    expect(() => convertRegistrationDataToMyUserRegistrationModel({
      ...VALID_REGISTRATION_DATA,
      confirmPassword: 'SomethingDifferent456!'
    })).toThrow()
  })
})
