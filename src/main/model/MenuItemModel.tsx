import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { FoodNameModel } from './food/FoodNameModel'
import { ImageUrlModel } from './food/ImageUrlModel'
import { PriceModel } from './food/PriceModel'
import { ERR_MSG_ALLERGEN_IDS_LIST_REQUIRED, ERR_MSG_CATEGORY_REQUIRED, ERR_MSG_FOOD_ID_REQUIRED, ERR_MSG_FOOD_NAME_REQUIRED, ERR_MSG_IMAGE_URL_REQUIRED, ERR_MSG_PRICE_REQUIRED } from '../utils/FoodUtils'
import { NotBlank } from '../myDecorators/NotBlank'
import { AllergenModel } from './food/AllergenModel'

export class MenuItemModel {
  @NotNull({ message: ERR_MSG_FOOD_ID_REQUIRED })
  @NotUndefined({ message: ERR_MSG_FOOD_ID_REQUIRED })
    foodId: number

  @NotNull({ message: ERR_MSG_FOOD_NAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_FOOD_NAME_REQUIRED })
    foodName: FoodNameModel

  @NotNull({ message: ERR_MSG_PRICE_REQUIRED })
  @NotUndefined({ message: ERR_MSG_PRICE_REQUIRED })
    price: PriceModel

  @NotBlank({ message: ERR_MSG_CATEGORY_REQUIRED })
    category: string

  @NotNull({ message: ERR_MSG_ALLERGEN_IDS_LIST_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ALLERGEN_IDS_LIST_REQUIRED })
    allergens: AllergenModel[]

  @NotNull({ message: ERR_MSG_IMAGE_URL_REQUIRED })
  @NotUndefined({ message: ERR_MSG_IMAGE_URL_REQUIRED })
    imageUrl: ImageUrlModel

  constructor(
    foodId: number,
    foodName: FoodNameModel,
    price: PriceModel,
    category: string,
    allergens: AllergenModel[],
    imageUrl: ImageUrlModel
  ) {
    this.foodId = foodId,
    this.foodName = foodName,
    this.price = price,
    this.category = category,
    this.allergens = allergens,
    this.imageUrl = imageUrl
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
