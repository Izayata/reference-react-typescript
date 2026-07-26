import { validateSync, ValidationError } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED, ERR_MSG_NEW_PASSWORD_REQUIRED, ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE } from '../utils/PasswordChangeUtils'
import { PasswordModel } from './myUser/PasswordModel'

export class NewPasswordDetailsModel {
  @NotNull({ message: ERR_MSG_NEW_PASSWORD_REQUIRED })
  @NotUndefined({ message: ERR_MSG_NEW_PASSWORD_REQUIRED })
    newPassword: PasswordModel
  
  @NotNull({ message: ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED })
  @NotUndefined({ message: ERR_MSG_CONFIRM_NEW_PASSWORD_REQUIRED })
    confirmNewPassword: PasswordModel

  constructor(
    newPassword: PasswordModel,
    confirmNewPassword: PasswordModel
  ) {
    this.newPassword = newPassword
    this.confirmNewPassword = confirmNewPassword

    const errors: ValidationError[] = validateSync(this)

    if (
      this.newPassword !== null
      && this.newPassword !== undefined
      && this.confirmNewPassword !== null
      && this.confirmNewPassword !== undefined
      && this.newPassword.value !== this.confirmNewPassword.value
    ) {
      const passwordMismatchError = new ValidationError()
      passwordMismatchError.property = 'confirmNewPassword'
      passwordMismatchError.constraints = { confirmNewPasswordNotMatchesNewPassword: ERR_MSG_NEW_PASSWORD_VALUE_DO_NOT_MATCH_CONFIRM_NEW_PASSWORD_VALUE }
      errors.push(passwordMismatchError)
    }

    if (errors.length > 0) {
      throw errors
    }
  }
}