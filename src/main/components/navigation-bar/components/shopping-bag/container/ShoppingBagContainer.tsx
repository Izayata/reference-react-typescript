import { RefObject } from 'react'
import { ShoppingBagButton } from '../button/ShoppingBagButton'
import { ShoppingBagDropdown } from '../dropdown/ShoppingBagDropdown'
import './ShoppingBagContainer.css'
import { useLocation } from 'react-router-dom'

interface ShoppingBagContainerProps {
  shoppingBagOpen: boolean;
  setShoppingBagOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement>
}

export function ShoppingBagContainer({ shoppingBagOpen, setShoppingBagOpen, dropdownRef }: ShoppingBagContainerProps) {
  const location = useLocation()

  return (
    <div
      className={`
        shopping-bag-container
        ${location.pathname === '/cart' || location.pathname === '/checkout' ? 'at-cart-or-checkout-page' : ''}
        ${location.pathname === '/gallery' ? 'at-gallery-page' : ''}
      `}
      ref={dropdownRef}
    >
      <ShoppingBagButton
        shoppingBagOpen={shoppingBagOpen}
        setShoppingBagOpen={setShoppingBagOpen}
        dropdownRef={dropdownRef}
      />
      {shoppingBagOpen && (
        <ShoppingBagDropdown onClick={() => setShoppingBagOpen(false)} />
      )}
    </div>
  )
}
