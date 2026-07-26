import React from 'react'
import '../../../css/button/application-button-style.css'
import { toast } from 'react-toastify'

interface AddToCartButtonProps {
  foodId: number
  style?: React.CSSProperties
  classNameAddOns?: string
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ foodId, style, classNameAddOns }) => {
  const handleAddToCart = () => {
    const shoppingCart = JSON.parse(localStorage.getItem('shopping_cart') || '{}')
    if (shoppingCart[foodId]) {
      shoppingCart[foodId] += 1
    } else {
      shoppingCart[foodId] = 1
    }
    localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
    toast.success('Tétel hozzáadva a kosárhoz!')
  }

  return (
    <button
      className={`application-button-style animated ${classNameAddOns}`}
      style={style}
      onClick={handleAddToCart}
    >
      Kosárba
    </button>
  )
}
