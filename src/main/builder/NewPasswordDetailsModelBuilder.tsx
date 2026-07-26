import { PasswordModel } from '../model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../model/NewPasswordDetailsModel'

export class NewPasswordDetailsModelBuilder {
  private newPassword?: PasswordModel
  private confirmNewPassword?: PasswordModel

  setNewPassword(newPassword: string) {
    this.newPassword = new PasswordModel(newPassword)
    return this
  }

  setConfirmNewPassword(confirmNewPassword: string) {
    this.confirmNewPassword = new PasswordModel(confirmNewPassword)
    return this
  }

  build() {
    return new NewPasswordDetailsModel(
      this.newPassword!,
      this.confirmNewPassword!
    )
  }
}
