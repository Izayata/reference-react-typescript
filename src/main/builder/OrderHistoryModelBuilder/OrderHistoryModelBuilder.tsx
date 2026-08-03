import { OrderHistoryModel } from '../../model/OrderHistoryModel'
import { OrderHistoryItemModel } from '../../model/orderHistory/OrderHistoryItemModel'

export class OrderHistoryModelBuilder {
  private id?: number
  private orderItems?: OrderHistoryItemModel[]
  private totalCost?: number
  private totalCostCurrency?: string
  private paymentType?: string
  private createdAt?: string | null

  setId(id: number) {
    this.id = id
    return this
  }

  setOrderItems(orderItems: OrderHistoryItemModel[]) {
    this.orderItems = orderItems
    return this
  }

  setTotalCost(totalCost: number) {
    this.totalCost = totalCost
    return this
  }

  setTotalCostCurrency(totalCostCurrency: string) {
    this.totalCostCurrency = totalCostCurrency
    return this
  }

  setPaymentType(paymentType: string) {
    this.paymentType = paymentType
    return this
  }

  setCreatedAt(createdAt: string | null) {
    this.createdAt = createdAt
    return this
  }

  build() {
    return new OrderHistoryModel(
      this.id!,
      this.orderItems!,
      this.totalCost!,
      this.totalCostCurrency!,
      this.paymentType!,
      this.createdAt
    )
  }
}
