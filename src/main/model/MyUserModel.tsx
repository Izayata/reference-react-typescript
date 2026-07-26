import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { ERR_MSG_USERNAME_REQUIRED } from '../utils/myUser/UsernameUtils'
import { CustomerModel } from './CustomerModel'
import { EmailModel } from './EmailModel'
import { UsernameModel } from './myUser/UsernameModel'
import { ERR_MSG_CUSTOMER_REQUIRED } from '../utils/MyUserModelUtils'

export class MyUserModel {
  @NotNull({ message: ERR_MSG_USERNAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_USERNAME_REQUIRED })
    myUsername: UsernameModel

  @NotNull({ message: ERR_MSG_EMAIL_REQUIRED })
  @NotUndefined({ message: ERR_MSG_EMAIL_REQUIRED })
    email: EmailModel

  @NotNull({ message: ERR_MSG_CUSTOMER_REQUIRED })
  @NotUndefined({ message: ERR_MSG_CUSTOMER_REQUIRED })
    customer: CustomerModel

  constructor(
    email: EmailModel,
    myUsername: UsernameModel,
    customer: CustomerModel
  ) {
    this.email = email
    this.myUsername = myUsername
    this.customer = customer
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }   
  }
}
