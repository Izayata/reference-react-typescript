import { OrderHistoryItemModel } from './OrderHistoryItemModel'
import { FoodNameModel } from '../food/FoodNameModel'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'
import {
  ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED
} from '../../utils/orderHistory/OrderHistoryUtils'

const VALID_FOOD_NAME_MODEL = new FoodNameModel('Gulyásleves')

// Invalid cases
const ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_ID_UNDEFINED = () => new OrderHistoryItemModel(undefined as any, VALID_FOOD_NAME_MODEL, 2, 3800)
const ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_ID_NULL = () => new OrderHistoryItemModel(null as any, VALID_FOOD_NAME_MODEL, 2, 3800)
const ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_NAME_UNDEFINED = () => new OrderHistoryItemModel(1, undefined as any, 2, 3800)
const ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_NAME_NULL = () => new OrderHistoryItemModel(1, null as any, 2, 3800)
const ERR_ORDER_HISTORY_ITEM_MODEL_QUANTITY_UNDEFINED = () => new OrderHistoryItemModel(1, VALID_FOOD_NAME_MODEL, undefined as any, 3800)
const ERR_ORDER_HISTORY_ITEM_MODEL_QUANTITY_NULL = () => new OrderHistoryItemModel(1, VALID_FOOD_NAME_MODEL, null as any, 3800)
const ERR_ORDER_HISTORY_ITEM_MODEL_PRICE_UNDEFINED = () => new OrderHistoryItemModel(1, VALID_FOOD_NAME_MODEL, 2, undefined as any)
const ERR_ORDER_HISTORY_ITEM_MODEL_PRICE_NULL = () => new OrderHistoryItemModel(1, VALID_FOOD_NAME_MODEL, 2, null as any)

// Valid case
const VALID_ORDER_HISTORY_ITEM_MODEL = () => new OrderHistoryItemModel(1, VALID_FOOD_NAME_MODEL, 2, 3800)

describe('OrderHistoryItemModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined foodId', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_ID_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED], 1)
  })

  it('should throw required error for null foodId', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_ID_NULL, [ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED], 1)
  })

  it('should throw required error for undefined foodName', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_NAME_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED], 1)
  })

  it('should throw required error for null foodName', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_FOOD_NAME_NULL, [ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED], 1)
  })

  it('should throw required error for undefined quantity', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_QUANTITY_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED], 1)
  })

  it('should throw required error for null quantity', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_QUANTITY_NULL, [ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED], 1)
  })

  it('should throw required error for undefined orderItemPrice', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_PRICE_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED], 1)
  })

  it('should throw required error for null orderItemPrice', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_ITEM_MODEL_PRICE_NULL, [ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED], 1)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid order history item', () => {
    expect(VALID_ORDER_HISTORY_ITEM_MODEL).not.toThrow()
  })

  it('assigns all constructor parameters to their fields', () => {
    const item = VALID_ORDER_HISTORY_ITEM_MODEL()
    expect(item.foodId).toBe(1)
    expect(item.foodName.value).toBe('Gulyásleves')
    expect(item.quantity).toBe(2)
    expect(item.orderItemPrice).toBe(3800)
  })

  describe('equals', () => {
    it('returns true for two items with the same values', () => {
      const a = VALID_ORDER_HISTORY_ITEM_MODEL()
      const b = VALID_ORDER_HISTORY_ITEM_MODEL()
      expect(a.equals(b)).toBe(true)
    })

    it('returns false when quantity differs', () => {
      const a = VALID_ORDER_HISTORY_ITEM_MODEL()
      const b = new OrderHistoryItemModel(1, VALID_FOOD_NAME_MODEL, 5, 3800)
      expect(a.equals(b)).toBe(false)
    })

    it('returns false when compared to null', () => {
      const a = VALID_ORDER_HISTORY_ITEM_MODEL()
      expect(a.equals(null as any)).toBe(false)
    })
  })
})
