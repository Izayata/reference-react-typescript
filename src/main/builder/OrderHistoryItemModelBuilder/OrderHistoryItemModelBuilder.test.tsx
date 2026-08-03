import { OrderHistoryItemModelBuilder } from './OrderHistoryItemModelBuilder'
import { FoodNameModel } from '../../model/food/FoodNameModel'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'
import { expectSetterReturnsSameInstance } from '../../utils/test/ExpectSetterChaining'
import {
  ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED
} from '../../utils/orderHistory/OrderHistoryUtils'

const VALID_FOOD_NAME_MODEL = new FoodNameModel('Gulyásleves')

// Invalid cases
const ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_FOOD_ID_UNDEFINED = () => new OrderHistoryItemModelBuilder()
  .setFoodName(VALID_FOOD_NAME_MODEL)
  .setQuantity(2)
  .setOrderItemPrice(3800)
  .build()

const ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_FOOD_NAME_UNDEFINED = () => new OrderHistoryItemModelBuilder()
  .setFoodId(1)
  .setQuantity(2)
  .setOrderItemPrice(3800)
  .build()

const ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_QUANTITY_UNDEFINED = () => new OrderHistoryItemModelBuilder()
  .setFoodId(1)
  .setFoodName(VALID_FOOD_NAME_MODEL)
  .setOrderItemPrice(3800)
  .build()

const ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_PRICE_UNDEFINED = () => new OrderHistoryItemModelBuilder()
  .setFoodId(1)
  .setFoodName(VALID_FOOD_NAME_MODEL)
  .setQuantity(2)
  .build()

// Valid case
const VALID_ORDER_HISTORY_ITEM_MODEL_BUILDER = () => new OrderHistoryItemModelBuilder()
  .setFoodId(1)
  .setFoodName(VALID_FOOD_NAME_MODEL)
  .setQuantity(2)
  .setOrderItemPrice(3800)
  .build()

describe('OrderHistoryItemModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined foodId', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_FOOD_ID_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED], 1)
  })

  it('should throw required error for undefined foodName', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_FOOD_NAME_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED], 1)
  })

  it('should throw required error for undefined quantity', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_QUANTITY_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED], 1)
  })

  it('should throw required error for undefined orderItemPrice', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_BUILDER_PRICE_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED], 1)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid order history item', () => {
    expect(VALID_ORDER_HISTORY_ITEM_MODEL_BUILDER).not.toThrow()
  })

  it('setFoodId returns the same builder instance for chaining', () => {
    const builder = new OrderHistoryItemModelBuilder()
    expectSetterReturnsSameInstance(builder, b => b.setFoodId(1))
  })

  it('setFoodId overwrites a previously set value', () => {
    const item = new OrderHistoryItemModelBuilder()
      .setFoodId(99)
      .setFoodId(1)
      .setFoodName(VALID_FOOD_NAME_MODEL)
      .setQuantity(2)
      .setOrderItemPrice(3800)
      .build()
    expect(item.foodId).toBe(1)
  })
})
