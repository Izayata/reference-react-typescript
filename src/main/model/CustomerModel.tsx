import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { AddressModel } from './customer/AddressModel'
import { EmailModel } from './EmailModel'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { ERR_MSG_BILLING_ADDRESS_REQUIRED, ERR_MSG_SHIPPING_ADDRESS_REQUIRED } from '../utils/customer/AddressUtils'
import { PersonalDetailsModel } from './PersonalDetailsModel'
import { ERR_MSG_PERSONAL_DETAILS_REQUIRED } from '../utils/PersonalDetailsUtils'

export class CustomerModel {
  @NotNull({ message: ERR_MSG_PERSONAL_DETAILS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_PERSONAL_DETAILS_REQUIRED })
    personalDetails: PersonalDetailsModel

  @NotNull({ message: ERR_MSG_EMAIL_REQUIRED })
  @NotUndefined({ message: ERR_MSG_EMAIL_REQUIRED })
    email: EmailModel

  @NotNull({ message: ERR_MSG_SHIPPING_ADDRESS_REQUIRED })
  @NotUndefined({ message:  ERR_MSG_SHIPPING_ADDRESS_REQUIRED})
    shippingAddress: AddressModel

  @NotNull({ message: ERR_MSG_BILLING_ADDRESS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_BILLING_ADDRESS_REQUIRED })
    billingAddress: AddressModel

  constructor(
    personalDetails: PersonalDetailsModel,
    email: EmailModel,
    shippingAddress: AddressModel,
    billingAddress: AddressModel,
  ) {
    this.personalDetails = personalDetails
    this.email = email
    this.shippingAddress = shippingAddress
    this.billingAddress = billingAddress
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
