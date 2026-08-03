import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../../myDecorators/NotBlank'
import { ERR_MSG_DOOR_VALUE_FORMAT, ERR_MSG_DOOR_VALUE_LENGTH, ERR_MSG_DOOR_VALUE_REQUIRED, DOOR_VALUE_ALLOWED_REGEX, DOOR_VALUE_MAX_LENGTH, DOOR_VALUE_MIN_LENGTH } from '../../../utils/customer/address/DoorUtils'

export class DoorModel {
  @NotBlank({ message: ERR_MSG_DOOR_VALUE_REQUIRED })
  @Matches(DOOR_VALUE_ALLOWED_REGEX, { message: ERR_MSG_DOOR_VALUE_FORMAT })
  @Length(DOOR_VALUE_MIN_LENGTH, DOOR_VALUE_MAX_LENGTH, { message: ERR_MSG_DOOR_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: DoorModel | null | undefined): boolean {
    if (!other) return false
    return this.value.toLocaleLowerCase('hu') === other.value.toLocaleLowerCase('hu')
  }
}
