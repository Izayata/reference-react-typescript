const SHOPPING_CART_STORAGE_KEY = 'shopping_cart'

export function readShoppingCart(): Record<string, number> {
  return JSON.parse(localStorage.getItem(SHOPPING_CART_STORAGE_KEY) || '{}')
}

export function addToShoppingCart(foodId: number, quantity: number): void {
  const shoppingCart = readShoppingCart()
  shoppingCart[foodId] = (shoppingCart[foodId] || 0) + quantity
  localStorage.setItem(SHOPPING_CART_STORAGE_KEY, JSON.stringify(shoppingCart))
}
