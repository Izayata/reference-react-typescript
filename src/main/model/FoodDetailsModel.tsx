import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { AllergenNameModel } from './food/allergen/AllergenNameModel'
import { DescriptionModel } from './food/DescriptionModel'
import { FoodNameModel } from './food/FoodNameModel'
import { ImageUrlModel } from './food/ImageUrlModel'
import { IngredientNameModel } from './food/ingredient/IngredientNameModel'
import { PriceModel } from './food/PriceModel'
import { ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED, ERR_MSG_DESCRIPTION_REQUIRED, ERR_MSG_FOOD_NAME_REQUIRED, ERR_MSG_IMAGE_URL_REQUIRED, ERR_MSG_INGREDIENT_NAME_REQUIRED, ERR_MSG_PRICE_REQUIRED } from '../utils/FoodUtils'
import { AllergenModel } from './food/AllergenModel'

export class FoodDetailsModel {
  @NotNull({ message: ERR_MSG_FOOD_NAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_FOOD_NAME_REQUIRED })
  foodName: FoodNameModel

  @NotNull({ message: ERR_MSG_PRICE_REQUIRED })
  @NotUndefined({ message: ERR_MSG_PRICE_REQUIRED })
  price: PriceModel

  @NotNull({ message: ERR_MSG_DESCRIPTION_REQUIRED })
  @NotUndefined({ message: ERR_MSG_DESCRIPTION_REQUIRED })
  description: DescriptionModel

  @NotNull({ message: ERR_MSG_INGREDIENT_NAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_INGREDIENT_NAME_REQUIRED })
  ingredientNames: IngredientNameModel[]

  @NotNull({ message: ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED })
  allergens: AllergenModel[]

  @NotNull({ message: ERR_MSG_IMAGE_URL_REQUIRED })
  @NotUndefined({ message: ERR_MSG_IMAGE_URL_REQUIRED })
  imageUrl: ImageUrlModel

  constructor(
    foodName: FoodNameModel,
    price: PriceModel,
    description: DescriptionModel,
    ingredientNames: IngredientNameModel[],
    allergens: AllergenModel[],
    imageUrl: ImageUrlModel
  ) {
    this.foodName = foodName,
    this.price = price,
    this.description = description,
    this.ingredientNames = ingredientNames,
    this.allergens = allergens,
    this.imageUrl = imageUrl
    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }
}
