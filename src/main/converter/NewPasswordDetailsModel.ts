import { PasswordModel } from '../model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../model/NewPasswordDetailsModel'

export function convertRegistrationDataToNewPasswordDetailsModel(registrationData: {
  password: string
  confirmPassword: string
}): NewPasswordDetailsModel {
  return new NewPasswordDetailsModel(
    new PasswordModel(registrationData.password),
    new PasswordModel(registrationData.confirmPassword)
  )
}
