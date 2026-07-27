import { MenuItemModel } from '../../main/model/MenuItemModel'
import { FoodNameModel } from '../../main/model/food/FoodNameModel'
import { PriceModel } from '../../main/model/food/PriceModel'
import { ImageUrlModel } from '../../main/model/food/ImageUrlModel'
import {
  ERR_MSG_FOOD_ID_REQUIRED,
  ERR_MSG_FOOD_NAME_REQUIRED,
  ERR_MSG_PRICE_REQUIRED,
  ERR_MSG_CATEGORY_REQUIRED,
  ERR_MSG_ALLERGEN_IDS_LIST_REQUIRED,
  ERR_MSG_IMAGE_URL_REQUIRED
} from '../../main/utils/FoodUtils'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { AllergenModel } from '../../main/model/food/AllergenModel'
import { AllergenNameModel } from '../../main/model/food/allergen/AllergenNameModel'

// Valid models for composing MenuItemModel
const VALID_FOOD_ID = 1
const VALID_FOOD_NAME_MODEL = new FoodNameModel('Pizza')
const VALID_PRICE_MODEL = new PriceModel('1234', 'HUF')
const VALID_CATEGORY = 'Főétel'
const VALID_ALLERGENS = [new AllergenModel(1, new AllergenNameModel('Glutén'), 'faWheatAwn')]
const VALID_IMAGE_URL_MODEL = new ImageUrlModel('https://example.com/pizza.jpg')

// Invalid cases
const ERR_MENU_ITEM_MODEL_FOOD_ID_UNDEFINED = () => new MenuItemModel(
  undefined as any,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_FOOD_ID_NULL = () => new MenuItemModel(
  null as any,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_FOOD_NAME_UNDEFINED = () => new MenuItemModel(
  VALID_FOOD_ID,
  undefined as any,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_FOOD_NAME_NULL = () => new MenuItemModel(
  VALID_FOOD_ID,
  null as any,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_PRICE_UNDEFINED = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  undefined as any,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_PRICE_NULL = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  null as any,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_CATEGORY_UNDEFINED = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  undefined as any,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_CATEGORY_NULL = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  null as any,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_CATEGORY_EMPTY_STRING = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  '',
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_CATEGORY_BLANK = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  '   ',
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_ALLERGEN_IDS_UNDEFINED = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  undefined as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_ALLERGEN_IDS_NULL = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  null as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_MENU_ITEM_MODEL_IMAGE_URL_UNDEFINED = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  undefined as any
)
const ERR_MENU_ITEM_MODEL_IMAGE_URL_NULL = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  null as any
)

// Valid case
const VALID_MENU_ITEM_MODEL = () => new MenuItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_CATEGORY,
  VALID_ALLERGENS,
  VALID_IMAGE_URL_MODEL
)

describe('MenuItemModel', () => {
  
  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined foodId', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_FOOD_ID_UNDEFINED,
      [ERR_MSG_FOOD_ID_REQUIRED],
      1
    )
  })
  it('should throw required error for null foodId', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_FOOD_ID_NULL,
      [ERR_MSG_FOOD_ID_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined foodName', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_FOOD_NAME_UNDEFINED,
      [ERR_MSG_FOOD_NAME_REQUIRED],
      1
    )
  })
  it('should throw required error for null foodName', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_FOOD_NAME_NULL,
      [ERR_MSG_FOOD_NAME_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined price', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_PRICE_UNDEFINED,
      [ERR_MSG_PRICE_REQUIRED],
      1
    )
  })
  it('should throw required error for null price', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_PRICE_NULL,
      [ERR_MSG_PRICE_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined category', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_CATEGORY_UNDEFINED,
      [ERR_MSG_CATEGORY_REQUIRED],
      1
    )
  })
  it('should throw required error for null category', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_CATEGORY_NULL,
      [ERR_MSG_CATEGORY_REQUIRED],
      1
    )
  })
  it('should throw required error for empty string category', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_CATEGORY_EMPTY_STRING,
      [ERR_MSG_CATEGORY_REQUIRED],
      1
    )
  })
  it('should throw required error for blank category', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_CATEGORY_BLANK,
      [ERR_MSG_CATEGORY_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined allergenIds', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_ALLERGEN_IDS_UNDEFINED,
      [ERR_MSG_ALLERGEN_IDS_LIST_REQUIRED],
      1
    )
  })
  it('should throw required error for null allergenIds', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_ALLERGEN_IDS_NULL,
      [ERR_MSG_ALLERGEN_IDS_LIST_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined imageUrl', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_IMAGE_URL_UNDEFINED,
      [ERR_MSG_IMAGE_URL_REQUIRED],
      1
    )
  })
  it('should throw required error for null imageUrl', () => {
    expectErrorMessages(
      ERR_MENU_ITEM_MODEL_IMAGE_URL_NULL,
      [ERR_MSG_IMAGE_URL_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid menu item model', () => {
    expect(VALID_MENU_ITEM_MODEL).not.toThrow()
  })
})
