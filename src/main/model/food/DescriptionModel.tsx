import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../myDecorators/NotBlank'
import { DESCRIPTION_VALUE_ALLOWED_CHARACTERS, DESCRIPTION_VALUE_MAX_LENGTH, DESCRIPTION_VALUE_MIN_LENGTH, ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS, ERR_MSG_DESCRIPTION_VALUE_LENGTH, ERR_MSG_DESCRIPTION_VALUE_REQUIRED } from '../../utils/food/DescriptionUtils'

export class DescriptionModel {
  @NotBlank({ message: ERR_MSG_DESCRIPTION_VALUE_REQUIRED })
  @Matches(DESCRIPTION_VALUE_ALLOWED_CHARACTERS, { message: ERR_MSG_DESCRIPTION_VALUE_INVALID_CHARACTERS })
  @Length(DESCRIPTION_VALUE_MIN_LENGTH, DESCRIPTION_VALUE_MAX_LENGTH, { message: ERR_MSG_DESCRIPTION_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
