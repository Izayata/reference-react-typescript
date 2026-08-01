import { convertRegistrationDataToNewPasswordDetailsModel } from './NewPasswordDetailsModel'
import { ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE } from '../utils/PasswordChangeUtils'

const VALID_REGISTRATION_DATA = {
  password: 'ValidPass123!',
  confirmPassword: 'ValidPass123!',
}

describe('convertRegistrationDataToNewPasswordDetailsModel', () => {
  it('maps password and confirmPassword onto newPassword/confirmNewPassword', () => {
    const model = convertRegistrationDataToNewPasswordDetailsModel(VALID_REGISTRATION_DATA)

    expect(model.newPassword.value).toBe('ValidPass123!')
    expect(model.confirmNewPassword.value).toBe('ValidPass123!')
  })

  it('propagates the mismatch validation error when the two passwords differ', () => {
    try {
      convertRegistrationDataToNewPasswordDetailsModel({
        password: 'ValidPass123!',
        confirmPassword: 'DifferentPass456!'
      })
      throw new Error('Expected error was not thrown')
    } catch (errors) {
      const messages = Array.isArray(errors)
        ? errors.flatMap((err: any) => err.constraints ? Object.values(err.constraints) : [])
        : []
      expect(messages).toContain(ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE)
    }
  })
})
