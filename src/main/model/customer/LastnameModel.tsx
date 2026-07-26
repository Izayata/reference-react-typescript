import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../myDecorators/NotBlank'
import { ERR_MSG_LASTNAME_VALUE_FORMAT, ERR_MSG_LASTNAME_VALUE_LENGTH, ERR_MSG_LASTNAME_VALUE_REQUIRED, LASTNAME_VALUE_ALLOWED_REGEX, LASTNAME_VALUE_MAX_LENGTH, LASTNAME_VALUE_MIN_LENGTH } from '../../utils/customer/LastnameUtils'

export class LastnameModel {
  @NotBlank({ message: ERR_MSG_LASTNAME_VALUE_REQUIRED })
  @Matches(LASTNAME_VALUE_ALLOWED_REGEX, { message: ERR_MSG_LASTNAME_VALUE_FORMAT })
  @Length(LASTNAME_VALUE_MIN_LENGTH, LASTNAME_VALUE_MAX_LENGTH, { message: ERR_MSG_LASTNAME_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: LastnameModel): boolean {
    if (!other) return false
    return this.value.toLocaleLowerCase('hu') === other.value.toLocaleLowerCase('hu')
  }
}
