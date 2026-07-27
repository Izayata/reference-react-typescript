import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping } from '@fortawesome/free-solid-svg-icons'
import { RefObject, useEffect } from 'react'
import './css/shopping-bag-icon.css'

interface ShoppingBagButtonProps {
  shoppingBagOpen: boolean;
  setShoppingBagOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement>
}

export function ShoppingBagButton({ shoppingBagOpen, setShoppingBagOpen, dropdownRef }: ShoppingBagButtonProps) {
  useEffect(() => {
    shoppingBagOpen
      ? document.querySelector('.fa-bag-shopping')?.classList.add('active')
      : document.querySelector('.fa-bag-shopping')?.classList.remove('active')
  }, [shoppingBagOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShoppingBagOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <FontAwesomeIcon
      icon={faBagShopping}
      className='button-scale'
      onClick={() => setShoppingBagOpen(!shoppingBagOpen)}
    />
  )
}
