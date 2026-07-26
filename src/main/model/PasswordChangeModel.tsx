import { validateSync, ValidationError } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { ERR_MSG_CURRENT_PASSWORD_REQUIRED, ERR_MSG_NEW_PASSWORD_VALUE_MATCHES_CURRENT_PASSWORD_VALUE, ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED } from '../utils/PasswordChangeUtils'
import { PasswordModel } from './myUser/PasswordModel'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { NewPasswordDetailsModel } from './NewPasswordDetailsModel'

export class PasswordChangeModel {
  @NotNull({ message: ERR_MSG_CURRENT_PASSWORD_REQUIRED })
  @NotUndefined({ message: ERR_MSG_CURRENT_PASSWORD_REQUIRED })
    currentPassword: PasswordModel

  @NotNull({ message: ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED })
    newPasswordDetails: NewPasswordDetailsModel

  constructor(
    currentPassword: PasswordModel,
    newPasswordDetails: NewPasswordDetailsModel
  ) {
    this.currentPassword = currentPassword
    this.newPasswordDetails = newPasswordDetails

    const errors: ValidationError[] = validateSync(this)

    if (
      this.newPasswordDetails !== null
      && this.newPasswordDetails !== undefined
      && this.currentPassword !== null
      && this.currentPassword !== undefined
      && this.newPasswordDetails.newPassword.value === this.currentPassword.value
    ) {
      const samePasswordError = new ValidationError()
      samePasswordError.property = 'newPassword'
      samePasswordError.constraints = { newPasswordMatchesCurrentPassword: ERR_MSG_NEW_PASSWORD_VALUE_MATCHES_CURRENT_PASSWORD_VALUE }
      errors.push(samePasswordError)
    }

    if (errors.length > 0) {
      throw errors
    }
  }
}
