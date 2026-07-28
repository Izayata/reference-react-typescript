import { validateSync } from 'class-validator'
import { NotNull } from '../myDecorators/NotNull'
import { NotUndefined } from '../myDecorators/NotUndefined'
import { CustomerModel } from './CustomerModel'
import { OrderItemModel } from './order/OrderItemModel'

export class OrderModel {
    @NotNull({ message: 'Customer email is required (null)' })
    @NotUndefined({ message: 'Customer email is required (undefined)' })
      customer?: CustomerModel

    @NotNull({ message: 'Order items are required (null)' })
    @NotUndefined({ message: 'Order items are required (undefined)' })
      orderItems: OrderItemModel[]

    @NotNull({ message: 'Payment type is required (null)' })
    @NotUndefined({ message: 'Payment type is required (undefined)' })
      paymentType: string

    constructor(
      customer: CustomerModel,
      orderItems: OrderItemModel[],
      paymentType: string
    ) {
      this.customer = customer
      this.orderItems = orderItems
      this.paymentType = paymentType
      const errors = validateSync(this)
      if (errors.length > 0) {
        throw errors
      }
    }
}