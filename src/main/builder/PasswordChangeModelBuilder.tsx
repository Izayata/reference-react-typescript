import { PasswordModel } from '../model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../model/NewPasswordDetailsModel'
import { PasswordChangeModel } from '../model/PasswordChangeModel'

export class PasswordChangeModelBuilder {
  private currentPassword?: PasswordModel
  private newPasswordDetails?: NewPasswordDetailsModel

  setCurrentPassword(currentPassword: PasswordModel) {
    this.currentPassword = currentPassword
    return this
  }

  setNewPasswordDetails(newPasswordDetails: NewPasswordDetailsModel) {
    this.newPasswordDetails = newPasswordDetails
    return this
  }

  build() {
    return new PasswordChangeModel(
      this.currentPassword!,
      this.newPasswordDetails!
    )
  }
}