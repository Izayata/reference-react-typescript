import { Length, Matches, validateSync } from "class-validator";
import { NotBlank } from "../../myDecorators/NotBlank";
import { ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS, ERR_MSG_FOOD_NAME_VALUE_LENGTH, ERR_MSG_FOOD_NAME_VALUE_REQUIRED, FOOD_NAME_VALUE_ALLOWED_CHARACTERS, FOOD_NAME_VALUE_MAX_LENGTH, FOOD_NAME_VALUE_MIN_LENGTH } from "../../utils/food/FoodNameUtils";

export class FoodNameModel {
  @NotBlank({ message: ERR_MSG_FOOD_NAME_VALUE_REQUIRED })
  @Matches(FOOD_NAME_VALUE_ALLOWED_CHARACTERS, { message: ERR_MSG_FOOD_NAME_VALUE_INVALID_CHARACTERS })
  @Length(FOOD_NAME_VALUE_MIN_LENGTH, FOOD_NAME_VALUE_MAX_LENGTH, { message: ERR_MSG_FOOD_NAME_VALUE_LENGTH })
  value: string

  constructor(value: string) {
    this.value = value;
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw errors;
    }
  }
}
