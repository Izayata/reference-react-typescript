import { OrderHistoryModel } from './OrderHistoryModel'
import { OrderHistoryItemModel } from './orderHistory/OrderHistoryItemModel'
import { FoodNameModel } from './food/FoodNameModel'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import {
  ERR_MSG_ORDER_HISTORY_ID_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED,
  ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED,
  ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED,
  ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED
} from '../utils/orderHistory/OrderHistoryUtils'

const VALID_ORDER_ITEMS = [
  new OrderHistoryItemModel(1, new FoodNameModel('Gulyásleves'), 2, 3800)
]

// Invalid cases
const ERR_ORDER_HISTORY_MODEL_ID_UNDEFINED = () => new OrderHistoryModel(undefined as any, VALID_ORDER_ITEMS, 3800, 'HUF', 'CASH')
const ERR_ORDER_HISTORY_MODEL_ID_NULL = () => new OrderHistoryModel(null as any, VALID_ORDER_ITEMS, 3800, 'HUF', 'CASH')
const ERR_ORDER_HISTORY_MODEL_ORDER_ITEMS_UNDEFINED = () => new OrderHistoryModel(1, undefined as any, 3800, 'HUF', 'CASH')
const ERR_ORDER_HISTORY_MODEL_ORDER_ITEMS_NULL = () => new OrderHistoryModel(1, null as any, 3800, 'HUF', 'CASH')
const ERR_ORDER_HISTORY_MODEL_TOTAL_COST_UNDEFINED = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, undefined as any, 'HUF', 'CASH')
const ERR_ORDER_HISTORY_MODEL_TOTAL_COST_NULL = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, null as any, 'HUF', 'CASH')
const ERR_ORDER_HISTORY_MODEL_TOTAL_COST_CURRENCY_UNDEFINED = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, 3800, undefined as any, 'CASH')
const ERR_ORDER_HISTORY_MODEL_TOTAL_COST_CURRENCY_NULL = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, 3800, null as any, 'CASH')
const ERR_ORDER_HISTORY_MODEL_PAYMENT_TYPE_UNDEFINED = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, 3800, 'HUF', undefined as any)
const ERR_ORDER_HISTORY_MODEL_PAYMENT_TYPE_NULL = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, 3800, 'HUF', null as any)

// Valid cases
const VALID_ORDER_HISTORY_MODEL = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, 3800, 'HUF', 'CASH', '2026-07-14T18:32:00Z')
const VALID_ORDER_HISTORY_MODEL_NO_CREATED_AT = () => new OrderHistoryModel(1, VALID_ORDER_ITEMS, 3800, 'HUF', 'CASH')

describe('OrderHistoryModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined id', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_ID_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ID_REQUIRED], 1)
  })

  it('should throw required error for null id', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_ID_NULL, [ERR_MSG_ORDER_HISTORY_ID_REQUIRED], 1)
  })

  it('should throw required error for undefined orderItems', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_ORDER_ITEMS_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED], 1)
  })

  it('should throw required error for null orderItems', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_ORDER_ITEMS_NULL, [ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED], 1)
  })

  it('should throw required error for undefined totalCost', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_TOTAL_COST_UNDEFINED, [ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED], 1)
  })

  it('should throw required error for null totalCost', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_TOTAL_COST_NULL, [ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED], 1)
  })

  it('should throw required error for undefined totalCostCurrency', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_TOTAL_COST_CURRENCY_UNDEFINED, [ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED], 1)
  })

  it('should throw required error for null totalCostCurrency', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_TOTAL_COST_CURRENCY_NULL, [ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED], 1)
  })

  it('should throw required error for undefined paymentType', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_PAYMENT_TYPE_UNDEFINED, [ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED], 1)
  })

  it('should throw required error for null paymentType', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_PAYMENT_TYPE_NULL, [ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED], 1)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid order history entry', () => {
    expect(VALID_ORDER_HISTORY_MODEL).not.toThrow()
  })

  it('defaults createdAt to null when omitted', () => {
    expect(VALID_ORDER_HISTORY_MODEL_NO_CREATED_AT).not.toThrow()
    expect(VALID_ORDER_HISTORY_MODEL_NO_CREATED_AT().createdAt).toBeNull()
  })

  it('assigns all constructor parameters to their fields', () => {
    const order = VALID_ORDER_HISTORY_MODEL()
    expect(order.id).toBe(1)
    expect(order.orderItems).toBe(VALID_ORDER_ITEMS)
    expect(order.totalCost).toBe(3800)
    expect(order.totalCostCurrency).toBe('HUF')
    expect(order.paymentType).toBe('CASH')
    expect(order.createdAt).toBe('2026-07-14T18:32:00Z')
  })

  describe('equals', () => {
    it('returns true for two orders with the same values', () => {
      const a = VALID_ORDER_HISTORY_MODEL()
      const b = VALID_ORDER_HISTORY_MODEL()
      expect(a.equals(b)).toBe(true)
    })

    it('returns false when totalCost differs', () => {
      const a = VALID_ORDER_HISTORY_MODEL()
      const b = new OrderHistoryModel(1, VALID_ORDER_ITEMS, 9999, 'HUF', 'CASH', '2026-07-14T18:32:00Z')
      expect(a.equals(b)).toBe(false)
    })

    it('returns false when compared to null', () => {
      const a = VALID_ORDER_HISTORY_MODEL()
      expect(a.equals(null as any)).toBe(false)
    })
  })
})
