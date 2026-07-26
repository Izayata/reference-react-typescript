import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { ERR_MSG_LASTNAME_REQUIRED } from '../utils/customer/LastnameUtils'
import { ERR_MSG_PHONE_NUMBER_REQUIRED } from '../utils/customer/PhoneNumberUtils'
import { FirstnameModel } from './customer/FirstnameModel'
import { LastnameModel } from './customer/LastnameModel'
import { PhoneNumberModel } from './customer/PhoneNumberModel'
import { ERR_MSG_FIRSTNAME_REQUIRED } from '../utils/customer/FirstnameUtils'

export class PersonalDetailsModel {
  @NotNull({ message: ERR_MSG_FIRSTNAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_FIRSTNAME_REQUIRED })
    firstname: FirstnameModel

  @NotNull({ message: ERR_MSG_LASTNAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_LASTNAME_REQUIRED })
    lastname: LastnameModel

  @NotNull({ message: ERR_MSG_PHONE_NUMBER_REQUIRED })
  @NotUndefined({ message: ERR_MSG_PHONE_NUMBER_REQUIRED })
    phoneNumber: PhoneNumberModel

  constructor(
    firstname: FirstnameModel,
    lastname: LastnameModel,
    phoneNumber: PhoneNumberModel
  ) {
    this.firstname = firstname
    this.lastname = lastname
    this.phoneNumber = phoneNumber
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: PersonalDetailsModel): boolean {
    if (!other) return false
    return this.firstname.equals(other.firstname) &&
           this.lastname.equals(other.lastname) &&
           this.phoneNumber.equals(other.phoneNumber)
  }
}
