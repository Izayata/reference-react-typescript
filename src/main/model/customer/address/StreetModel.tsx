import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../../myDecorators/NotBlank'
import { ERR_MSG_STREET_VALUE_FORMAT, ERR_MSG_STREET_VALUE_LENGTH, ERR_MSG_STREET_VALUE_REQUIRED, STREET_VALUE_ALLOWED_REGEX, STREET_VALUE_MAX_LENGTH, STREET_VALUE_MIN_LENGTH } from '../../../utils/customer/address/StreetUtils'

export class StreetModel {
  @NotBlank({ message: ERR_MSG_STREET_VALUE_REQUIRED })
  @Matches(STREET_VALUE_ALLOWED_REGEX, { message: ERR_MSG_STREET_VALUE_FORMAT })
  @Length(STREET_VALUE_MIN_LENGTH, STREET_VALUE_MAX_LENGTH, { message: ERR_MSG_STREET_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: StreetModel): boolean {
    if (!other) return false
    return this.value.toLocaleLowerCase('hu') === other.value.toLocaleLowerCase('hu')
  }
}
