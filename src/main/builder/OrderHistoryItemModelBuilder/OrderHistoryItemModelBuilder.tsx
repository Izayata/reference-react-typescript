import { OrderHistoryItemModel } from '../../model/orderHistory/OrderHistoryItemModel'
import { FoodNameModel } from '../../model/food/FoodNameModel'

export class OrderHistoryItemModelBuilder {
  private foodId?: number
  private foodName?: FoodNameModel
  private quantity?: number
  private orderItemPrice?: number

  setFoodId(foodId: number) {
    this.foodId = foodId
    return this
  }

  setFoodName(foodName: FoodNameModel) {
    this.foodName = foodName
    return this
  }

  setQuantity(quantity: number) {
    this.quantity = quantity
    return this
  }

  setOrderItemPrice(orderItemPrice: number) {
    this.orderItemPrice = orderItemPrice
    return this
  }

  build() {
    return new OrderHistoryItemModel(
      this.foodId!,
      this.foodName!,
      this.quantity!,
      this.orderItemPrice!
    )
  }
}
