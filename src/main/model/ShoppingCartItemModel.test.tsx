import { ShoppingCartItemModel } from './ShoppingCartItemModel'
import { FoodNameModel } from './food/FoodNameModel'
import { PriceModel } from './food/PriceModel'
import { ImageUrlModel } from './food/ImageUrlModel'
import {
  ERR_MSG_FOOD_ID_REQUIRED,
  ERR_MSG_FOOD_NAME_REQUIRED,
  ERR_MSG_PRICE_REQUIRED,
  ERR_MSG_IMAGE_URL_REQUIRED
} from '../utils/FoodUtils'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'

// Valid models for composing ShoppingCartItemModel
const VALID_FOOD_ID = 1
const VALID_FOOD_NAME_MODEL = new FoodNameModel('Pizza')
const VALID_PRICE_MODEL = new PriceModel('1234', 'HUF')
const VALID_IMAGE_URL_MODEL = new ImageUrlModel('https://example.com/pizza.jpg')

// Invalid cases
const ERR_SHOPPING_CART_ITEM_MODEL_FOOD_ID_UNDEFINED = () => new ShoppingCartItemModel(
  undefined as any,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_IMAGE_URL_MODEL
)
const ERR_SHOPPING_CART_ITEM_MODEL_FOOD_ID_NULL = () => new ShoppingCartItemModel(
  null as any,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_IMAGE_URL_MODEL
)
const ERR_SHOPPING_CART_ITEM_MODEL_FOOD_NAME_UNDEFINED = () => new ShoppingCartItemModel(
  VALID_FOOD_ID,
  undefined as any,
  VALID_PRICE_MODEL,
  VALID_IMAGE_URL_MODEL
)
const ERR_SHOPPING_CART_ITEM_MODEL_FOOD_NAME_NULL = () => new ShoppingCartItemModel(
  VALID_FOOD_ID,
  null as any,
  VALID_PRICE_MODEL,
  VALID_IMAGE_URL_MODEL
)
const ERR_SHOPPING_CART_ITEM_MODEL_PRICE_UNDEFINED = () => new ShoppingCartItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  undefined as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_SHOPPING_CART_ITEM_MODEL_PRICE_NULL = () => new ShoppingCartItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  null as any,
  VALID_IMAGE_URL_MODEL
)
const ERR_SHOPPING_CART_ITEM_MODEL_IMAGE_URL_UNDEFINED = () => new ShoppingCartItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  undefined as any
)
const ERR_SHOPPING_CART_ITEM_MODEL_IMAGE_URL_NULL = () => new ShoppingCartItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  null as any
)

// Valid case
const VALID_SHOPPING_CART_ITEM_MODEL = () => new ShoppingCartItemModel(
  VALID_FOOD_ID,
  VALID_FOOD_NAME_MODEL,
  VALID_PRICE_MODEL,
  VALID_IMAGE_URL_MODEL
)

describe('ShoppingCartItemModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined foodId', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_FOOD_ID_UNDEFINED,
      [ERR_MSG_FOOD_ID_REQUIRED],
      1
    )
  })
  it('should throw required error for null foodId', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_FOOD_ID_NULL,
      [ERR_MSG_FOOD_ID_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined foodName', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_FOOD_NAME_UNDEFINED,
      [ERR_MSG_FOOD_NAME_REQUIRED],
      1
    )
  })
  it('should throw required error for null foodName', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_FOOD_NAME_NULL,
      [ERR_MSG_FOOD_NAME_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined price', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_PRICE_UNDEFINED,
      [ERR_MSG_PRICE_REQUIRED],
      1
    )
  })
  it('should throw required error for null price', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_PRICE_NULL,
      [ERR_MSG_PRICE_REQUIRED],
      1
    )
  })
  it('should throw required error for undefined imageUrl', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_IMAGE_URL_UNDEFINED,
      [ERR_MSG_IMAGE_URL_REQUIRED],
      1
    )
  })
  it('should throw required error for null imageUrl', () => {
    expectErrorMessages(
      ERR_SHOPPING_CART_ITEM_MODEL_IMAGE_URL_NULL,
      [ERR_MSG_IMAGE_URL_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid shopping cart item model', () => {
    expect(VALID_SHOPPING_CART_ITEM_MODEL).not.toThrow()
  })
})
