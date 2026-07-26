import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { ERR_MSG_USERNAME_REQUIRED } from '../utils/myUser/UsernameUtils'
import { EmailModel } from './EmailModel'
import { UsernameModel } from './myUser/UsernameModel'

export class ForgottenPasswordRequestModel {
  @NotNull({ message: ERR_MSG_EMAIL_REQUIRED })
  @NotUndefined({ message: ERR_MSG_EMAIL_REQUIRED })
    email: EmailModel
  @NotNull({ message: ERR_MSG_USERNAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_USERNAME_REQUIRED })
    myUsername: UsernameModel

  constructor(email: EmailModel, username: UsernameModel) {
    this.email = email
    this.myUsername = username
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}