import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../../myDecorators/NotBlank'
import { ERR_MSG_FLOOR_VALUE_FORMAT, ERR_MSG_FLOOR_VALUE_LENGTH, ERR_MSG_FLOOR_VALUE_REQUIRED, FLOOR_VALUE_ALLOWED_REGEX, FLOOR_VALUE_MAX_LENGTH, FLOOR_VALUE_MIN_LENGTH } from '../../../utils/customer/address/FloorUtils'

export class FloorModel {
  @NotBlank({ message: ERR_MSG_FLOOR_VALUE_REQUIRED })
  @Matches(FLOOR_VALUE_ALLOWED_REGEX, { message: ERR_MSG_FLOOR_VALUE_FORMAT })
  @Length(FLOOR_VALUE_MIN_LENGTH, FLOOR_VALUE_MAX_LENGTH, { message: ERR_MSG_FLOOR_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: FloorModel | null | undefined): boolean {
    if (!other) return false
    return this.value.toLocaleLowerCase('hu') === other.value.toLocaleLowerCase('hu')
  }
}
