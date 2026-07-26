import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../../myDecorators/NotBlank'
import { CITY_VALUE_ALLOWED_REGEX, CITY_VALUE_MAX_LENGTH, CITY_VALUE_MIN_LENGTH, ERR_MSG_CITY_VALUE_FORMAT, ERR_MSG_CITY_VALUE_LENGTH, ERR_MSG_CITY_VALUE_REQUIRED } from '../../../utils/customer/address/CityUtils'

export class CityModel {
  @NotBlank({ message: ERR_MSG_CITY_VALUE_REQUIRED })
  @Matches(CITY_VALUE_ALLOWED_REGEX, { message: ERR_MSG_CITY_VALUE_FORMAT })
  @Length(CITY_VALUE_MIN_LENGTH, CITY_VALUE_MAX_LENGTH, { message: ERR_MSG_CITY_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: CityModel): boolean {
    if (!other) return false
    return this.value.toLocaleLowerCase('hu') === other.value.toLocaleLowerCase('hu')
  }
}
