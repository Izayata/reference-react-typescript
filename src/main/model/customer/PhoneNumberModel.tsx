import { Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../myDecorators/NotBlank'
import { ValidPhoneNumber } from '../../myDecorators/ValidPhoneNumber'
import { ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS, ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED, PHONE_NUMBER_VALUE_ALLOWED_REGEX } from '../../utils/customer/PhoneNumberUtils'

export class PhoneNumberModel {
  @NotBlank({ message: ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED })
  @ValidPhoneNumber({ message: ERR_MSG_PHONE_NUMBER_VALUE_INVALID})
  @Matches(PHONE_NUMBER_VALUE_ALLOWED_REGEX, { message: ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: PhoneNumberModel): boolean {
    if (!other) return false
    return this.value === other.value
  }
}
