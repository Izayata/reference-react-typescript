import { PasswordModel } from '../model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../model/NewPasswordDetailsModel'
import { NewPasswordDetailsModelBuilder } from '../builder/NewPasswordDetailsModelBuilder'

export function convertRegistrationDataToNewPasswordDetailsModel(registrationData: {
  password: string
  confirmPassword: string
}): NewPasswordDetailsModel {
  return new NewPasswordDetailsModelBuilder()
    .setNewPassword(new PasswordModel(registrationData.password))
    .setConfirmNewPassword(new PasswordModel(registrationData.confirmPassword))
    .build()
}
