import { validateSync } from 'class-validator'
import { NotBlank } from '../myDecorators/NotBlank'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { NewPasswordDetailsModel } from './NewPasswordDetailsModel'

export class ResetPasswordRequestModel {
  @NotBlank({ message: 'A token megadása kötelező' })
    token: string
  @NotNull({ message: 'Új jelszót tartalmazó mező megadása kötelező' })
  @NotUndefined({ message: 'Új jelszót tartalmazó mező megadása kötelező' })
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