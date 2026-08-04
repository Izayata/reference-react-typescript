import { convertToOrderHistoryModel, convertToOrderHistoryModels } from './OrderHistoryModelConverter'

const VALID_RAW_ORDER = {
  id: 1,
  orderItems: [
    {
      food: { id: 1, foodName: { value: 'Gulyásleves' } },
      quantity: 2,
      orderItemPrice: 3800
    }
  ],
  totalCost: 3800,
  totalCostCurrency: 'HUF',
  paymentType: 'CASH',
  createdAt: '2026-07-14T18:32:00Z'
}

describe('OrderHistoryModelConverter', () => {
  describe('convertToOrderHistoryModel', () => {
    it('maps a raw order response onto an OrderHistoryModel', () => {
      const order = convertToOrderHistoryModel(VALID_RAW_ORDER)

      expect(order.id).toBe(1)
      expect(order.totalCost).toBe(3800)
      expect(order.totalCostCurrency).toBe('HUF')
      expect(order.paymentType).toBe('CASH')
      expect(order.createdAt).toBe('2026-07-14T18:32:00Z')
      expect(order.orderItems).toHaveLength(1)
      expect(order.orderItems[0].foodId).toBe(1)
      expect(order.orderItems[0].foodName.value).toBe('Gulyásleves')
      expect(order.orderItems[0].quantity).toBe(2)
      expect(order.orderItems[0].orderItemPrice).toBe(3800)
    })

    it('defaults createdAt to null when the response omits it', () => {
      const { createdAt, ...rawWithoutCreatedAt } = VALID_RAW_ORDER
      const order = convertToOrderHistoryModel(rawWithoutCreatedAt)

      expect(order.createdAt).toBeNull()
    })

    it('propagates the underlying model validation error for an invalid field', () => {
      expect(() => convertToOrderHistoryModel({
        ...VALID_RAW_ORDER,
        orderItems: [
          { food: { id: 1, foodName: { value: 'Gulyásleves' } }, quantity: null as any, orderItemPrice: 3800 }
        ]
      })).toThrow()
    })
  })

  describe('convertToOrderHistoryModels', () => {
    it('maps an array of raw order responses onto OrderHistoryModel instances', () => {
      const orders = convertToOrderHistoryModels([VALID_RAW_ORDER, { ...VALID_RAW_ORDER, id: 2 }])

      expect(orders).toHaveLength(2)
      expect(orders[0].id).toBe(1)
      expect(orders[1].id).toBe(2)
    })

    it('maps an empty array to an empty array', () => {
      expect(convertToOrderHistoryModels([])).toEqual([])
    })

    it('skips an order with an invalid food name and still converts the valid ones', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
      const INVALID_RAW_ORDER = {
        ...VALID_RAW_ORDER,
        id: 99,
        orderItems: [
          { food: { id: 1, foodName: { value: '@Invalid' } }, quantity: 1, orderItemPrice: 1000 }
        ]
      }

      const orders = convertToOrderHistoryModels([VALID_RAW_ORDER, INVALID_RAW_ORDER, { ...VALID_RAW_ORDER, id: 2 }])

      expect(orders).toHaveLength(2)
      expect(orders.map(order => order.id)).toEqual([1, 2])
      expect(warnSpy).toHaveBeenCalledTimes(1)
      warnSpy.mockRestore()
    })
  })
})
