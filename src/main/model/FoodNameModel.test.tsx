import { FoodDetailsModel } from './FoodDetailsModel'
import { FoodNameModel } from './food/FoodNameModel'
import { PriceModel } from './food/PriceModel'
import { DescriptionModel } from './food/DescriptionModel'
import { IngredientNameModel } from './food/ingredient/IngredientNameModel'
import { AllergenNameModel } from './food/allergen/AllergenNameModel'
import { ImageUrlModel } from './food/ImageUrlModel'
import {
  ERR_MSG_FOOD_NAME_REQUIRED,
  ERR_MSG_PRICE_REQUIRED,
  ERR_MSG_DESCRIPTION_REQUIRED,
  ERR_MSG_INGREDIENT_NAME_REQUIRED,
  ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED,
  ERR_MSG_IMAGE_URL_REQUIRED
} from '../utils/FoodUtils'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { AllergenModel } from './food/AllergenModel'

// Valid models for composing FoodDetialsModel
const VALID_FOOD_NAME_MODEL = new FoodNameModel('Pizza')
const VALID_PRICE_MODEL = new PriceModel('1234', 'HUF')
const VALID_DESCRIPTION_MODEL = new DescriptionModel('Finom pizza')
const VALID_INGREDIENT_NAME_MODEL = new IngredientNameModel('Sajt')
const VALID_ALLERGENS = [new AllergenModel(1, new AllergenNameModel('Glutén'), 'faWheatAwn')]
const VALID_IMAGE_URL_MODEL = new ImageUrlModel('https://example.com/pizza.jpg')

// Invalid cases
const ERR_FOOD_DETAILS_MODEL_FOODNAME_UNDEFINED = () => new FoodDetailsModel(
  undefined as any,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_FOODNAME_NULL = () => new FoodDetailsModel(
  null as any,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_PRICE_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  undefined as any,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_PRICE_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  null as any,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_DESCRIPTION_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  undefined as any,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_DESCRIPTION_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  null as any,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_INGREDIENTS_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  undefined as any,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_INGREDIENTS_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  null as any,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_ALLERGENS_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  undefined as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_ALLERGENS_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  null as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_IMAGEURL_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  undefined as any
)
const ERR_FOOD_DETAILS_MODEL_IMAGEURL_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  null as any
)

// Valid case
const VALID_FOOD_DETAILS_MODEL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  [VALID_INGREDIENT_NAME_MODEL],
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)

describe('FoodDetailsModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined foodName', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_FOODNAME_UNDEFINED,
      [ERR_MSG_FOOD_NAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null foodName', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_FOODNAME_NULL,
      [ERR_MSG_FOOD_NAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined price', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_PRICE_UNDEFINED,
      [ERR_MSG_PRICE_REQUIRED],
      1
    )
  })

  it('should throw required error for null price', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_PRICE_NULL,
      [ERR_MSG_PRICE_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined description', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_DESCRIPTION_UNDEFINED,
      [ERR_MSG_DESCRIPTION_REQUIRED],
      1
    )
  })

  it('should throw required error for null description', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_DESCRIPTION_NULL,
      [ERR_MSG_DESCRIPTION_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined ingredientNames', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_INGREDIENTS_UNDEFINED,
      [ERR_MSG_INGREDIENT_NAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null ingredientNames', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_INGREDIENTS_NULL,
      [ERR_MSG_INGREDIENT_NAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined allergenNames', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_ALLERGENS_UNDEFINED,
      [ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED],
      1
    )
  })

  it('should throw required error for null allergenNames', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_ALLERGENS_NULL,
      [ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined imageUrl', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_IMAGEURL_UNDEFINED,
      [ERR_MSG_IMAGE_URL_REQUIRED],
      1
    )
  })

  it('should throw required error for null imageUrl', () => {
    expectErrorMessages(
      ERR_FOOD_DETAILS_MODEL_IMAGEURL_NULL,
      [ERR_MSG_IMAGE_URL_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid food details model', () => {
    expect(VALID_FOOD_DETAILS_MODEL).not.toThrow()
  })
})
