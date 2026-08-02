import { PasswordModel } from '../../model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../../model/NewPasswordDetailsModel'

export class NewPasswordDetailsModelBuilder {
  private newPassword?: PasswordModel
  private confirmNewPassword?: PasswordModel

  setNewPassword(newPassword: PasswordModel) {
    this.newPassword = newPassword
    return this
  }

  setConfirmNewPassword(confirmNewPassword: PasswordModel) {
    this.confirmNewPassword = confirmNewPassword
    return this
  }

  build() {
    return new NewPasswordDetailsModel(
      this.newPassword!,
      this.confirmNewPassword!
    )
  }
}
