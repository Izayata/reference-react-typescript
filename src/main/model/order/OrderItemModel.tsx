import { validateSync } from 'class-validator'
import { NotNull } from '../../myDecorators/NotNull'
import { NotUndefined } from '../../myDecorators/NotUndefined'

export class OrderItemModel {
    @NotNull({ message: 'Product ID is required (null)' })
    @NotUndefined({ message: 'Product ID is required (undefined)' })
      foodId: number

    @NotNull({ message: 'Quantity is required (null)' })
    @NotUndefined({ message: 'Quantity is required (undefined)' })
      quantity: number

    constructor(productId: number, quantity: number) {
      this.foodId = productId
      this.quantity = quantity
      const errors = validateSync(this)
      if (errors.length > 0) {
        throw errors
      }
    }
}