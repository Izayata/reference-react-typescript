import { OrderHistoryModelBuilder } from '../builder/OrderHistoryModelBuilder/OrderHistoryModelBuilder'
import { OrderHistoryItemModelBuilder } from '../builder/OrderHistoryItemModelBuilder/OrderHistoryItemModelBuilder'
import { FoodNameModel } from '../model/food/FoodNameModel'
import { OrderHistoryModel } from '../model/OrderHistoryModel'

interface OrderHistoryItemResponse {
  food: { id: number, foodName: { value: string } }
  quantity: number
  orderItemPrice: number
}

interface OrderHistoryResponse {
  id: number
  orderItems: OrderHistoryItemResponse[]
  totalCost: number
  totalCostCurrency: string
  paymentType: string
  createdAt?: string | null
}

export function convertToOrderHistoryModel(raw: OrderHistoryResponse): OrderHistoryModel {
  const orderItems = raw.orderItems.map(item =>
    new OrderHistoryItemModelBuilder()
      .setFoodId(item.food.id)
      .setFoodName(new FoodNameModel(item.food.foodName.value))
      .setQuantity(item.quantity)
      .setOrderItemPrice(item.orderItemPrice)
      .build()
  )

  return new OrderHistoryModelBuilder()
    .setId(raw.id)
    .setOrderItems(orderItems)
    .setTotalCost(raw.totalCost)
    .setTotalCostCurrency(raw.totalCostCurrency)
    .setPaymentType(raw.paymentType)
    .setCreatedAt(raw.createdAt ?? null)
    .build()
}

export function convertToOrderHistoryModels(rawList: OrderHistoryResponse[]): OrderHistoryModel[] {
  return rawList.map(convertToOrderHistoryModel)
}
