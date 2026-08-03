import React from 'react'
import '../../../css/button/application-button-style.css'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { addToShoppingCart } from '../../../utils/shoppingCart/ShoppingCartUtils'

interface AddToCartButtonProps {
  foodId: number
  style?: React.CSSProperties
  classNameAddOns?: string
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ foodId, style, classNameAddOns }) => {
  const { t } = useTranslation()

  const handleAddToCart = () => {
    addToShoppingCart(foodId, 1)
    toast.success(t('addToCart.toastSuccess'))
  }

  return (
    <button
      className={`application-button-style animated ${classNameAddOns}`}
      style={style}
      onClick={handleAddToCart}
    >
      {t('addToCart.button')}
    </button>
  )
}
