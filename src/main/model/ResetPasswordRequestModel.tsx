import { validateSync } from 'class-validator'
import { NotBlank } from '../myDecorators/NotBlank'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { NewPasswordDetailsModel } from './NewPasswordDetailsModel'
import i18n from '../i18n/i18n'

export class ResetPasswordRequestModel {
  @NotBlank({ message: i18n.t('errors.ERR_MSG_RESET_TOKEN_REQUIRED') })
    token: string
  @NotNull({ message: i18n.t('errors.ERR_MSG_RESET_NEW_PASSWORD_DETAILS_REQUIRED') })
  @NotUndefined({ message: i18n.t('errors.ERR_MSG_RESET_NEW_PASSWORD_DETAILS_REQUIRED') })
    newPasswordDetails: NewPasswordDetailsModel

  constructor(
    token: string,
    newPasswordDetails: NewPasswordDetailsModel
  ) {
    this.token = token
    this.newPasswordDetails = newPasswordDetails
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}