import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping } from '@fortawesome/free-solid-svg-icons'
import { RefObject, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './css/shopping-bag-icon.css'

interface ShoppingBagButtonProps {
  shoppingBagOpen: boolean;
  setShoppingBagOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement>
}

export function ShoppingBagButton({ shoppingBagOpen, setShoppingBagOpen, dropdownRef }: ShoppingBagButtonProps) {
  const { t } = useTranslation()

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
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setShoppingBagOpen(!shoppingBagOpen)
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={shoppingBagOpen}
      aria-controls="shopping-bag-dropdown"
      aria-label={t('nav.openCartAriaLabel')}
      focusable="true"
    />
  )
}
