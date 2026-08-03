import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { OrderHistoryItemModel } from './orderHistory/OrderHistoryItemModel'
import {
  ERR_MSG_ORDER_HISTORY_ID_REQUIRED,
  ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED,
  ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED,
  ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED,
  ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED
} from '../utils/orderHistory/OrderHistoryUtils'

export class OrderHistoryModel {
  @NotNull({ message: ERR_MSG_ORDER_HISTORY_ID_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_ID_REQUIRED })
    id: number

  @NotNull({ message: ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_ORDER_ITEMS_REQUIRED })
    orderItems: OrderHistoryItemModel[]

  @NotNull({ message: ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_TOTAL_COST_REQUIRED })
    totalCost: number

  @NotNull({ message: ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_TOTAL_COST_CURRENCY_REQUIRED })
    totalCostCurrency: string

  @NotNull({ message: ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED })
  @NotUndefined({ message: ERR_MSG_ORDER_HISTORY_PAYMENT_TYPE_REQUIRED })
    paymentType: string

  createdAt: string | null

  constructor(
    id: number,
    orderItems: OrderHistoryItemModel[],
    totalCost: number,
    totalCostCurrency: string,
    paymentType: string,
    createdAt?: string | null
  ) {
    this.id = id
    this.orderItems = orderItems
    this.totalCost = totalCost
    this.totalCostCurrency = totalCostCurrency
    this.paymentType = paymentType
    this.createdAt = createdAt || null

    const errors = validateSync(this)
    if (errors.length > 0) {
      throw errors
    }
  }

  equals(other: OrderHistoryModel): boolean {
    if (!other) return false
    return (
      this.id === other.id &&
      this.totalCost === other.totalCost &&
      this.totalCostCurrency === other.totalCostCurrency &&
      this.paymentType === other.paymentType &&
      this.createdAt === other.createdAt &&
      this.orderItems.length === other.orderItems.length &&
      this.orderItems.every((item, index) => item.equals(other.orderItems[index]))
    )
  }
}
