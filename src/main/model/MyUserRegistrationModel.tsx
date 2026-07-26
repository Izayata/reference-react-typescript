import { UsernameModel } from './myUser/UsernameModel'
import { EmailModel } from './EmailModel'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { validateSync, ValidationError } from 'class-validator'
import { ERR_MSG_USERNAME_REQUIRED } from '../utils/myUser/UsernameUtils'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { NewPasswordDetailsModel } from './NewPasswordDetailsModel'
import { ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED } from '../utils/PasswordChangeUtils'

export class MyUserRegistrationModel {
  @NotNull({ message: ERR_MSG_USERNAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_USERNAME_REQUIRED })
    myUsername: UsernameModel

  @NotNull({ message: ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_NEW_PASSWORD_DETAILS_REQUIRED })
    newPasswordDetails: NewPasswordDetailsModel

  @NotNull({ message: ERR_MSG_EMAIL_REQUIRED })
  @NotUndefined({ message: ERR_MSG_EMAIL_REQUIRED })
    email: EmailModel

  constructor(
    email: EmailModel,
    myUsername: UsernameModel,
    newPasswordDetails: NewPasswordDetailsModel
  ) {
    this.email = email
    this.myUsername = myUsername
    this.newPasswordDetails = newPasswordDetails

    const errors: ValidationError[] = validateSync(this)

    if (errors.length > 0) {
      throw errors
    }
  }
}
