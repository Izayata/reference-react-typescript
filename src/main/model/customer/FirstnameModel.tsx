import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../myDecorators/NotBlank'
import { ERR_MSG_FIRSTNAME_VALUE_FORMAT, ERR_MSG_FIRSTNAME_VALUE_LENGTH, ERR_MSG_FIRSTNAME_VALUE_REQUIRED, FIRSTNAME_VALUE_ALLOWED_REGEX, FIRSTNAME_VALUE_MAX_LENGTH, FIRSTNAME_VALUE_MIN_LENGTH } from '../../utils/customer/FirstnameUtils'

export class FirstnameModel {
  @NotBlank({ message: ERR_MSG_FIRSTNAME_VALUE_REQUIRED })
  @Matches(FIRSTNAME_VALUE_ALLOWED_REGEX, { message: ERR_MSG_FIRSTNAME_VALUE_FORMAT })
  @Length(FIRSTNAME_VALUE_MIN_LENGTH, FIRSTNAME_VALUE_MAX_LENGTH, { message: ERR_MSG_FIRSTNAME_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: FirstnameModel): boolean {
    if (!other) return false
    return this.value.toLocaleLowerCase('hu') === other.value.toLocaleLowerCase('hu')
  }
}
