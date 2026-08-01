import { FoodDetailsModel } from './FoodDetailsModel'
import { FoodNameModel } from './food/FoodNameModel'
import { PriceModel } from './food/PriceModel'
import { DescriptionModel } from './food/DescriptionModel'
import { IngredientNameModel } from './food/ingredient/IngredientNameModel'
import { AllergenModel } from './food/AllergenModel'
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

// Valid models for composing FoodDetailsModel
const VALID_FOOD_NAME_MODEL = new FoodNameModel('Pizza')
const VALID_PRICE_MODEL = new PriceModel('1234', 'HUF')
const VALID_DESCRIPTION_MODEL = new DescriptionModel('Finom, ropogós pizza sok sajttal.')
const VALID_INGREDIENT_NAMES = [new IngredientNameModel('Liszt')]
const VALID_ALLERGENS = [new AllergenModel(1, new AllergenNameModel('Glutén'), 'faWheatAwn')]
const VALID_IMAGE_URL_MODEL = new ImageUrlModel('https://example.com/pizza.jpg')

// Invalid cases
const ERR_FOOD_DETAILS_MODEL_FOOD_NAME_UNDEFINED = () => new FoodDetailsModel(
  undefined as any,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_FOOD_NAME_NULL = () => new FoodDetailsModel(
  null as any,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_PRICE_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  undefined as any,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_PRICE_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  null as any,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_DESCRIPTION_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  undefined as any,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_DESCRIPTION_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  null as any,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_INGREDIENT_NAMES_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  undefined as any,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_INGREDIENT_NAMES_NULL = () => new FoodDetailsModel(
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
  VALID_INGREDIENT_NAMES,
  undefined as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_ALLERGENS_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
  null as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_FOOD_DETAILS_MODEL_IMAGE_URL_UNDEFINED = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  undefined as any
)
const ERR_FOOD_DETAILS_MODEL_IMAGE_URL_NULL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
  VALID_ALLERGENS,
  null as any
)

// Valid case
const VALID_FOOD_DETAILS_MODEL = () => new FoodDetailsModel(
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_DESCRIPTION_MODEL,
  VALID_INGREDIENT_NAMES,
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
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_FOOD_NAME_UNDEFINED, [ERR_MSG_FOOD_NAME_REQUIRED], 1)
  })
  it('should throw required error for null foodName', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_FOOD_NAME_NULL, [ERR_MSG_FOOD_NAME_REQUIRED], 1)
  })
  it('should throw required error for undefined price', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_PRICE_UNDEFINED, [ERR_MSG_PRICE_REQUIRED], 1)
  })
  it('should throw required error for null price', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_PRICE_NULL, [ERR_MSG_PRICE_REQUIRED], 1)
  })
  it('should throw required error for undefined description', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_DESCRIPTION_UNDEFINED, [ERR_MSG_DESCRIPTION_REQUIRED], 1)
  })
  it('should throw required error for null description', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_DESCRIPTION_NULL, [ERR_MSG_DESCRIPTION_REQUIRED], 1)
  })
  it('should throw required error for undefined ingredientNames', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_INGREDIENT_NAMES_UNDEFINED, [ERR_MSG_INGREDIENT_NAME_REQUIRED], 1)
  })
  it('should throw required error for null ingredientNames', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_INGREDIENT_NAMES_NULL, [ERR_MSG_INGREDIENT_NAME_REQUIRED], 1)
  })
  it('should throw required error for undefined allergens', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_ALLERGENS_UNDEFINED, [ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED], 1)
  })
  it('should throw required error for null allergens', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_ALLERGENS_NULL, [ERR_MSG_ALLERGEN_NAMES_LIST_REQUIRED], 1)
  })
  it('should throw required error for undefined imageUrl', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_IMAGE_URL_UNDEFINED, [ERR_MSG_IMAGE_URL_REQUIRED], 1)
  })
  it('should throw required error for null imageUrl', () => {
    expectErrorMessages(ERR_FOOD_DETAILS_MODEL_IMAGE_URL_NULL, [ERR_MSG_IMAGE_URL_REQUIRED], 1)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid food details model', () => {
    expect(VALID_FOOD_DETAILS_MODEL).not.toThrow()
  })
})
