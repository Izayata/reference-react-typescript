import { validateSync } from 'class-validator'
import { NotNull } from '../../myDecorators/NotNull'
import { NotUndefined } from '../../myDecorators/NotUndefined'
import { AllergenNameModel } from './allergen/AllergenNameModel'
import { ERR_MSG_ALLERGEN_ID_REQUIRED, ERR_MSG_ALLERGEN_NAME_REQUIRED } from '../../utils/food/AllergenUtils'
import { NotBlank } from '../../myDecorators/NotBlank'

export class AllergenModel {
  @NotNull({ message: ERR_MSG_ALLERGEN_ID_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ALLERGEN_ID_REQUIRED })
  id: number

  @NotNull({ message: ERR_MSG_ALLERGEN_NAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ALLERGEN_NAME_REQUIRED })
  name: AllergenNameModel

  @NotBlank({ message: "Image icon name cannot be null or empty string or consists only of whitespace" })
  iconName: string

  constructor(id: number, name: AllergenNameModel, iconName: string) {
    this.id = id
    this.name = name
    this.iconName = iconName
    const errors = validateSync(this);
    if (errors.length > 0) {
      throw errors;
    }
  }
}
