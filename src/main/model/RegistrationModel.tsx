import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { ERR_MSG_BILLING_ADDRESS_REQUIRED, ERR_MSG_SHIPPING_ADDRESS_REQUIRED } from '../utils/customer/AddressUtils'
import { AddressModel } from './customer/AddressModel'
import { PersonalDetailsModel } from './PersonalDetailsModel'
import { ERR_MSG_PERSONAL_DETAILS_REQUIRED } from '../utils/PersonalDetailsUtils'
import { MyUserRegistrationModel } from './MyUserRegistrationModel'
import { ERR_MSG_MY_USER_REQUIRED } from '../utils/MyUserRegistrationUtils'


export class RegistrationModel {
  @NotNull({ message: ERR_MSG_MY_USER_REQUIRED })
  @NotUndefined({ message: ERR_MSG_MY_USER_REQUIRED })
    myUser: MyUserRegistrationModel

  @NotNull({ message: ERR_MSG_PERSONAL_DETAILS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_PERSONAL_DETAILS_REQUIRED })
    personalDetails: PersonalDetailsModel

  @NotNull({ message: ERR_MSG_SHIPPING_ADDRESS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_SHIPPING_ADDRESS_REQUIRED })
    shippingAddress: AddressModel

  @NotNull({ message: ERR_MSG_BILLING_ADDRESS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_BILLING_ADDRESS_REQUIRED })
    billingAddress: AddressModel

  constructor(
    myUser: MyUserRegistrationModel,
    personalDetails: PersonalDetailsModel,
    shippingAddress: AddressModel,
    billingAddress: AddressModel,
  ) {
    this.myUser = myUser
    this.personalDetails = personalDetails
    this.shippingAddress = shippingAddress
    this.billingAddress = billingAddress
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
