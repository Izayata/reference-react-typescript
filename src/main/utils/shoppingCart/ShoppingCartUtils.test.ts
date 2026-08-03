import { addToShoppingCart, readShoppingCart } from './ShoppingCartUtils'

describe('ShoppingCartUtils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('readShoppingCart', () => {
    it('returns an empty object when nothing is stored', () => {
      expect(readShoppingCart()).toEqual({})
    })

    it('returns the parsed stored cart', () => {
      localStorage.setItem('shopping_cart', JSON.stringify({ 1: 2 }))
      expect(readShoppingCart()).toEqual({ 1: 2 })
    })
  })

  describe('addToShoppingCart', () => {
    it('adds a new foodId with the given quantity', () => {
      addToShoppingCart(1, 2)
      expect(readShoppingCart()).toEqual({ 1: 2 })
    })

    it('adds to an existing foodId\'s quantity rather than overwriting it', () => {
      addToShoppingCart(1, 2)
      addToShoppingCart(1, 3)
      expect(readShoppingCart()).toEqual({ 1: 5 })
    })

    it('leaves other foodIds untouched', () => {
      addToShoppingCart(1, 2)
      addToShoppingCart(2, 1)
      expect(readShoppingCart()).toEqual({ 1: 2, 2: 1 })
    })
  })
})
