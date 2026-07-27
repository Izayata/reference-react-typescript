import { useEffect, useState } from 'react'
import { ShoppingCartItemModel } from '../../../../model/ShoppingCartItemModel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { MenuItemImage } from '../../Menu/MenuItemImage/MenuItemImage'
import { Link } from 'react-router-dom'

import './css/shopping-cart-content-container.css'
import './css/shopping-cart-decrement-button-icon.css'
import './css/shopping-cart-delete-btn.css'
import './css/shopping-cart-increment-button-icon.css'
import './css/shopping-cart-table.css'
import './css/shopping-cart-table-body.css'
import './css/shopping-cart-qty-input.css'
import './css/shopping-cart-order-item.css'
import './css/shopping-cart-order-item-container.css'
import './css/shopping-cart-order-item-details-container.css'
import './css/shopping-cart-order-item-image.css'
import './css/shopping-cart-order-item-image-container.css'
import './css/shopping-cart-order-item-name.css'
import './css/shopping-cart-order-item-name-price-container.css'
import './css/shopping-cart-order-item-price.css'
import './css/shopping-cart-order-item-quantity-changer.css'
import './css/shopping-cart-separator.css'
import { sleep } from '../../../../utils/sleep/SleepUtils'

// npm install @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons

export function DisplayShoppingCartContent({
  foods,
  setRefreshShoppingCart,
  setLoading
}: {
  foods: ShoppingCartItemModel[],
  setRefreshShoppingCart: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [refresh, setRefresh] = useState(false)
  const [priceAnimations, setPriceAnimations] = useState<{ [key: string]: boolean }>({})
  const [qtyAnimations, setQtyAnimations] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const stored = localStorage.getItem('shopping_cart')
    if (stored) {
      const cart = JSON.parse(stored)
      setQuantities(cart)
    }
  }, [])

  useEffect(() => {
    const wait = async () => {
      await sleep(1000)
    }
    wait()
  }, [refresh])

  const handleQuantityChange = (id: number, delta: number) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[id] || 1) + delta)
      const updated = { ...prev, [id]: newQty }
      localStorage.setItem('shopping_cart', JSON.stringify(updated))

      // Trigger price animation
      setPriceAnimations(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setPriceAnimations(prev => ({ ...prev, [id]: false }))
      }, 500)

      // Trigger qty animation
      setQtyAnimations(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setQtyAnimations(prev => ({ ...prev, [id]: false }))
      }, 500)

      return updated
    })
  }

  const handleQuantityInput = (id: number, value: string) => {
    const cleanValue = value.replace(/^0+/, '').replace(/\D/g, '')
    const num = Math.min(999, Math.max(1, Number(cleanValue) || 1))
    setQuantities(prev => {
      const updated = { ...prev, [id]: num }
      localStorage.setItem('shopping_cart', JSON.stringify(updated))

      // Trigger price animation
      setPriceAnimations(prev => ({ ...prev, [id]: true }))
      setTimeout(() => {
        setPriceAnimations(prev => ({ ...prev, [id]: false }))
      }, 500)

      return updated
    })
  }

  const handleDelete = (id: number) => {
    setQuantities(prev => {
      const updated = { ...prev }
      delete updated[id]
      localStorage.setItem('shopping_cart', JSON.stringify(updated))
      if (Object.keys(updated).length === 0) {
        setLoading(true)
        setRefreshShoppingCart(r => !r)
      }
      return updated
    })
    setRefresh(r => !r)
  }

  return (
    <div className="shopping-cart-content-container">
      <table className="shopping-cart-table">
        <tbody className='shopping-cart-table-body'>
          {(() => {
            const cartKeys = Object.keys(quantities).map(Number)
            return foods
              .filter(food => cartKeys.includes(food.foodId))
              .map(food => (
                <tr className='shopping-cart-order-item-container' key={food.foodId}>
                  <td className='shopping-cart-order-item'>
                    <Link
                      to={`/food/${food.foodId}`}
                      className='shopping-cart-order-item-image-container'
                    >
                      <MenuItemImage
                        className='shopping-cart-order-item-image'
                        src={food.imageUrl.value}
                        alt={food.foodName.value}
                      />
                    </Link>
                    <div className='shopping-cart-separator'/>
                  </td>
                  <div className='shopping-cart-order-item-name-price-container'>
                    <td className='shopping-cart-order-item-name'>
                      {food.foodName.value}
                    </td>
                    <td className={`shopping-cart-order-item-price ${priceAnimations[food.foodId] ? 'price-changed' : ''}`}>
                      {quantities[food.foodId] !== undefined
                        ? `${parseInt(
                          (
                            Number(food.price.amount) *
                            Number(quantities[food.foodId])
                          ).toString(),
                          10
                        )} ${food.price.currency === 'HUF' ? 'Ft' : food.price.currency}`
                        : ''}
                    </td>
                  </div>
                  <td className='shopping-cart-order-item-quantity-changer'>
                    <button
                      className="application-button-style shopping-cart-qty-btn"
                      onClick={() => food.foodId != null && handleQuantityChange(food.foodId, -1)}
                      disabled={food.foodId == null || quantities[food.foodId] <= 1}
                      aria-label="Csökkentés"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="number"
                      className={`shopping-cart-qty-input ${qtyAnimations[food.foodId] ? 'value-changed' : ''}`}
                      min={1}
                      max={999}
                      pattern="[1-9][0-9]{0,2}"
                      value={food.foodId != null ? quantities[food.foodId] : 1}
                      onChange={e =>
                        food.foodId != null && handleQuantityInput(food.foodId, e.target.value)
                      }
                      onInput={e => {
                        const input = e.target as HTMLInputElement
                        if (input.value.startsWith('0') && input.value.length > 1) {
                          input.value = input.value.replace(/^0+/, '') || '1'
                        }
                        if (Number(input.value) > 999) {
                          input.value = '999'
                        }
                      }}
                    />
                    <button
                      className="application-button-style shopping-cart-qty-btn"
                      onClick={() => food.foodId != null && handleQuantityChange(food.foodId, 1)}
                      disabled={food.foodId == null}
                      aria-label="Növelés"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </td>
                  <button
                    className="shopping-cart-delete-btn"
                    onClick={() => food.foodId != null && handleDelete(food.foodId)}
                    aria-label="Törlés"
                    title="Törlés"
                  >
                    <FontAwesomeIcon icon={faTrashCan}/>
                  </button>
                </tr>
              ))
          })()}
        </tbody>
      </table>
    </div>
  )
}
