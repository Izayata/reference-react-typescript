import { Length, Matches, validateSync } from 'class-validator'
import { NotBlank } from '../../../myDecorators/NotBlank'
import { ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS, ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH, ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED, INGREDIENT_NAME_VALUE_ALLOWED_CHARACTERS, INGREDIENT_NAME_VALUE_MAX_LENGTH, INGREDIENT_NAME_VALUE_MIN_LENGTH } from '../../../utils/food/ingredientName/IngredientNameUtils'

export class IngredientNameModel {
  @NotBlank({ message: ERR_MSG_INGREDIENT_NAME_VALUE_REQUIRED })
  @Matches(INGREDIENT_NAME_VALUE_ALLOWED_CHARACTERS, { message: ERR_MSG_INGREDIENT_NAME_INVALID_CHARACTERS })
  @Length(INGREDIENT_NAME_VALUE_MIN_LENGTH, INGREDIENT_NAME_VALUE_MAX_LENGTH, { message: ERR_MSG_INGREDIENT_NAME_VALUE_LENGTH })
    value: string

  constructor(value: string) {
    this.value = value
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
