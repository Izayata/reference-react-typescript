import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/i18n'
import { ShoppingCartItemModel } from '../../../model/ShoppingCartItemModel'
import { DisplayShoppingCartContent } from './DisplayShoppingCartContent/DisplayShoppingCartContent'
import { Link } from 'react-router-dom'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'

import './css/shopping-cart-container.css'
import './css/shopping-cart-empty-message.css'
import './css/shopping-cart-no-food-image.css'
import { sleep } from '../../../utils/sleep/SleepUtils'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'

export async function fetchFoodsByIds(ids: (string | number)[]) {
  const response = await fetch('/v1/foods/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
  if (!response.ok) throw new Error(i18n.t('shoppingCart.fetchFoodDetailsError'))
  return response.json()
}

export function ShoppingCart() {
  const { t } = useTranslation()
  const [foods, setFoods] = useState<ShoppingCartItemModel[]>([])
  const { setModalMessage } = useModal()
  const [loading, setLoading] = useState(true)
  const [refreshShoppingCart, setRefreshShoppingCart] = useState(false)

  const fetchData = async () => {
    const stored = localStorage.getItem('shopping_cart')
    if (stored) {
      const cart = JSON.parse(stored)
      const foodIds = Object.keys(cart)
      if (foodIds.length > 0) {
        fetchFoodsByIds(foodIds)
          .then(setFoods)
          .catch(err => setModalMessage(err.message))
          .finally(async () => {
            await sleep(1500)
            setLoading(false)
          })
      } else {
        setFoods([])
        await sleep(1500)
        setLoading(false)
      }
    } else {
      setFoods([])
      await sleep(1500)
      setLoading(false)
    }
  } 

  useEffect(() => {
    fetchData()
  }, [refreshShoppingCart])

  if (loading) return <LoadingOverlay />

  return(
    <>
      {!foods.length ?
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
          <h1 className='page-title'>{t('shoppingCart.emptyCartTitle')}</h1>
          <img className='shopping-cart-no-food-image' src="https://memesgenerator.hu/wp-content/uploads/mememe/2025/04/kaja-nem-lesz-115308-1.jpg" alt={t('shoppingCart.emptyCartImageAlt')} />
        </div>
        :
        <h1 className='page-title'>{t('shoppingCart.pageTitle')}</h1>}
      {foods.length > 0 && (
        <div className='shopping-cart-container'>
          <DisplayShoppingCartContent foods={foods} setRefreshShoppingCart={setRefreshShoppingCart} setLoading={setLoading}/>
          <Link to="/checkout" className="application-button-style shopping-cart-checkout-button">
            {t('shoppingCart.checkoutButton')}
          </Link>
        </div>
      )}
    </>
  )  
}
