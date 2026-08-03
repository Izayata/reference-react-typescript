import { OrderHistoryModelBuilder } from './OrderHistoryModelBuilder'
import { OrderHistoryItemModel } from '../../model/orderHistory/OrderHistoryItemModel'
import { FoodNameModel } from '../../model/food/FoodNameModel'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'
import { expectSetterReturnsSameInstance } from '../../utils/test/ExpectSetterChaining'
import {
  ERR_MSG_ORDER_HISTORY_ID_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED,
  ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED,
  ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED,
  ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED
} from '../../utils/orderHistory/OrderHistoryUtils'

const VALID_ORDER_ITEMS = [
  new OrderHistoryItemModel(1, new FoodNameModel('Gulyásleves'), 2, 3800)
]

// Invalid cases
const ERR_ORDER_HISTORY_MODEL_BUILDER_ID_UNDEFINED = () => new OrderHistoryModelBuilder()
  .setOrderItems(VALID_ORDER_ITEMS)
  .setTotalCost(3800)
  .setTotalCostCurrency('HUF')
  .setPaymentType('CASH')
  .build()

const ERR_ORDER_HISTORY_MODEL_BUILDER_ORDER_ITEMS_UNDEFINED = () => new OrderHistoryModelBuilder()
  .setId(1)
  .setTotalCost(3800)
  .setTotalCostCurrency('HUF')
  .setPaymentType('CASH')
  .build()

const ERR_ORDER_HISTORY_MODEL_BUILDER_TOTAL_COST_UNDEFINED = () => new OrderHistoryModelBuilder()
  .setId(1)
  .setOrderItems(VALID_ORDER_ITEMS)
  .setTotalCostCurrency('HUF')
  .setPaymentType('CASH')
  .build()

const ERR_ORDER_HISTORY_MODEL_BUILDER_TOTAL_COST_CURRENCY_UNDEFINED = () => new OrderHistoryModelBuilder()
  .setId(1)
  .setOrderItems(VALID_ORDER_ITEMS)
  .setTotalCost(3800)
  .setPaymentType('CASH')
  .build()

const ERR_ORDER_HISTORY_MODEL_BUILDER_PAYMENT_TYPE_UNDEFINED = () => new OrderHistoryModelBuilder()
  .setId(1)
  .setOrderItems(VALID_ORDER_ITEMS)
  .setTotalCost(3800)
  .setTotalCostCurrency('HUF')
  .build()

// Valid cases
const VALID_ORDER_HISTORY_MODEL_BUILDER = () => new OrderHistoryModelBuilder()
  .setId(1)
  .setOrderItems(VALID_ORDER_ITEMS)
  .setTotalCost(3800)
  .setTotalCostCurrency('HUF')
  .setPaymentType('CASH')
  .setCreatedAt('2026-07-14T18:32:00Z')
  .build()

const VALID_ORDER_HISTORY_MODEL_BUILDER_NO_CREATED_AT = () => new OrderHistoryModelBuilder()
  .setId(1)
  .setOrderItems(VALID_ORDER_ITEMS)
  .setTotalCost(3800)
  .setTotalCostCurrency('HUF')
  .setPaymentType('CASH')
  .build()

describe('OrderHistoryModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined id', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_BUILDER_ID_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ID_REQUIRED], 1)
  })

  it('should throw required error for undefined orderItems', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_BUILDER_ORDER_ITEMS_UNDEFINED, [ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED], 1)
  })

  it('should throw required error for undefined totalCost', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_BUILDER_TOTAL_COST_UNDEFINED, [ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED], 1)
  })

  it('should throw required error for undefined totalCostCurrency', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_BUILDER_TOTAL_COST_CURRENCY_UNDEFINED, [ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED], 1)
  })

  it('should throw required error for undefined paymentType', () => {
    expectErrorMessages(ERR_ORDER_HISTORY_MODEL_BUILDER_PAYMENT_TYPE_UNDEFINED, [ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED], 1)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid order history entry', () => {
    expect(VALID_ORDER_HISTORY_MODEL_BUILDER).not.toThrow()
  })

  it('should accept a valid order history entry without createdAt', () => {
    expect(VALID_ORDER_HISTORY_MODEL_BUILDER_NO_CREATED_AT).not.toThrow()
    expect(VALID_ORDER_HISTORY_MODEL_BUILDER_NO_CREATED_AT().createdAt).toBeNull()
  })

  it('setId returns the same builder instance for chaining', () => {
    const builder = new OrderHistoryModelBuilder()
    expectSetterReturnsSameInstance(builder, b => b.setId(1))
  })

  it('setId overwrites a previously set value', () => {
    const order = new OrderHistoryModelBuilder()
      .setId(99)
      .setId(1)
      .setOrderItems(VALID_ORDER_ITEMS)
      .setTotalCost(3800)
      .setTotalCostCurrency('HUF')
      .setPaymentType('CASH')
      .build()
    expect(order.id).toBe(1)
  })
})
