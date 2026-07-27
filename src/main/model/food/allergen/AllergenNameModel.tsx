import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../../myDecorators/NotBlank'
import { ALLERGEN_NAME_VALUE_ALLOWED_CHARACTERS, ALLERGEN_NAME_VALUE_MAX_LENGTH, ALLERGEN_NAME_VALUE_MIN_LENGTH, ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS, ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH, ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED } from '../../../utils/food/allergenName/AllergenNameUtils'

export class AllergenNameModel {
  @NotBlank({ message: ERR_MSG_ALLERGEN_NAME_VALUE_REQUIRED })
  @Matches(ALLERGEN_NAME_VALUE_ALLOWED_CHARACTERS, { message: ERR_MSG_ALLERGEN_NAME_INVALID_CHARACTERS })
  @Length(ALLERGEN_NAME_VALUE_MIN_LENGTH, ALLERGEN_NAME_VALUE_MAX_LENGTH, { message: ERR_MSG_ALLERGEN_NAME_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
