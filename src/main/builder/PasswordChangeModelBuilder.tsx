import { PasswordModel } from '../model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../model/NewPasswordDetailsModel'
import { PasswordChangeModel } from '../model/PasswordChangeModel'

export class PasswordChangeModelBuilder {
  private currentPassword?: PasswordModel
  private newPasswordWrapper?: NewPasswordDetailsModel

  setCurrentPassword(currentPassword: string) {
    this.currentPassword = new PasswordModel(currentPassword)
    return this
  }

  setNewPasswordWrapper(newPasswordWrapper: NewPasswordDetailsModel) {
    this.newPasswordWrapper = newPasswordWrapper
    return this
  }

  build() {
    return new PasswordChangeModel(
      this.currentPassword!,
      this.newPasswordWrapper!
    )
  }
}