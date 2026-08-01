import { OrderItemModel } from './OrderItemModel'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_ORDER_ITEM_MODEL_FOOD_ID_UNDEFINED = () => new OrderItemModel(undefined as any, 1)
const ERR_ORDER_ITEM_MODEL_FOOD_ID_NULL = () => new OrderItemModel(null as any, 1)
const ERR_ORDER_ITEM_MODEL_QUANTITY_UNDEFINED = () => new OrderItemModel(1, undefined as any)
const ERR_ORDER_ITEM_MODEL_QUANTITY_NULL = () => new OrderItemModel(1, null as any)

// Valid case
const VALID_ORDER_ITEM_MODEL = () => new OrderItemModel(1, 2)

describe('OrderItemModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined foodId', () => {
    expectErrorMessages(
      ERR_ORDER_ITEM_MODEL_FOOD_ID_UNDEFINED,
      ['Product ID is required (undefined)'],
      1
    )
  })

  it('should throw required error for null foodId', () => {
    expectErrorMessages(
      ERR_ORDER_ITEM_MODEL_FOOD_ID_NULL,
      ['Product ID is required (null)'],
      1
    )
  })

  it('should throw required error for undefined quantity', () => {
    expectErrorMessages(
      ERR_ORDER_ITEM_MODEL_QUANTITY_UNDEFINED,
      ['Quantity is required (undefined)'],
      1
    )
  })

  it('should throw required error for null quantity', () => {
    expectErrorMessages(
      ERR_ORDER_ITEM_MODEL_QUANTITY_NULL,
      ['Quantity is required (null)'],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid order item', () => {
    expect(VALID_ORDER_ITEM_MODEL).not.toThrow()
  })

  it('assigns the constructor\'s productId parameter to the foodId field', () => {
    const item = VALID_ORDER_ITEM_MODEL()
    expect(item.foodId).toBe(1)
    expect(item.quantity).toBe(2)
  })
})
