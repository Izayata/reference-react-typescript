import { validateSync } from 'class-validator'
import { NotNull } from '../../myDecorators/NotNull'
import { NotUndefined } from '../../myDecorators/NotUndefined'
import { FoodNameModel } from '../food/FoodNameModel'
import {
  ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED
} from '../../utils/orderHistory/OrderHistoryUtils'

export class OrderHistoryItemModel {
  @NotNull({ message: ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_ITEM_FOOD_ID_REQUIRED })
    foodId: number

  @NotNull({ message: ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_ITEM_FOOD_NAME_REQUIRED })
    foodName: FoodNameModel

  @NotNull({ message: ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_ITEM_QUANTITY_REQUIRED })
    quantity: number

  @NotNull({ message: ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_ITEM_PRICE_REQUIRED })
    orderItemPrice: number

  constructor(foodId: number, foodName: FoodNameModel, quantity: number, orderItemPrice: number) {
    this.foodId = foodId
    this.foodName = foodName
    this.quantity = quantity
    this.orderItemPrice = orderItemPrice

    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: OrderHistoryItemModel): boolean {
    if (!other) return false
    return (
      this.foodId === other.foodId &&
      this.foodName.value === other.foodName.value &&
      this.quantity === other.quantity &&
      this.orderItemPrice === other.orderItemPrice
    )
  }
}
