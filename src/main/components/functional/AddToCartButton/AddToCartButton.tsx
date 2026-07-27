import React from 'react'
import '../../../css/button/application-button-style.css'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

interface AddToCartButtonProps {
  foodId: number
  style?: React.CSSProperties
  classNameAddOns?: string
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ foodId, style, classNameAddOns }) => {
  const { t } = useTranslation()

  const handleAddToCart = () => {
    const shoppingCart = JSON.parse(localStorage.getItem('shopping_cart') || '{}')
    if (shoppingCart[foodId]) {
      shoppingCart[foodId] += 1
    } else {
      shoppingCart[foodId] = 1
    }
    localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
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
