import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FoodDetailsModel } from '../../../model/FoodDetailsModel'
import { AddToCartButton } from '../../functional/AddToCartButton/AddToCartButton'
import { MenuItemImage } from '../Menu/MenuItemImage/MenuItemImage'
import { Modal } from '../../functional/Modal/Modal'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'

import './css/food-details-actions.css'
import './css/food-details-allergens.css'
import './css/food-details-card-container.css'
import './css/food-details-container.css'
import './css/food-details-description.css'
import './css/food-details-info.css'
import './css/food-details-info-text.css'
import './css/food-details-image.css'
import './css/food-details-price.css'
import './css/food-details-separator.css'
import './css/food-details-title.css'

import { formatPrice } from '../Menu/Menu'
import { iconMap } from '../Menu/Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function FoodDetails() {
  const { t } = useTranslation()
  const { foodId } = useParams<{ foodId: string }>()
  const [food, setFood] = useState<FoodDetailsModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalMessage, setModalMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!foodId) {
      setModalMessage(t('foodDetails.missingFoodId'))
      return
    }
    fetch(`/v1/foods/${foodId}`)
      .then(res => {
        if (!res.ok) throw new Error(t('foodDetails.notFound'))
        return res.json()
      })
      .then(setFood)
      .catch(e => setModalMessage(e.message))
      .finally(() => setLoading(false))
  }, [foodId])

  if(loading) return <LoadingOverlay />

  if (modalMessage) {
    return <Modal message={modalMessage} onClose={() => setModalMessage(null)} />
  }

  if (!food) {
    return <Modal message={t('foodDetails.fetchFailed')} onClose={() => setModalMessage(null)} />
  }

  return (
    <section className='food-details-container'>
      <h2 className="page-title">{food.foodName.value}</h2>
      <div className="card-container food-details-page">
        {loading && <LoadingOverlay />}
        <MenuItemImage
          className="food-details-image"
          src={food.imageUrl.value}
          alt={food.foodName.value}
        />
        <div className='food-details-separator'/>
        <div className='food-details-info'>
          <div className='food-details-info-text'>
            <div className='food-details-description'>
              {food.description.value}
            </div>
            <div className="food-details-allergens">
              {t('foodDetails.allergensLabel')}
              <br />
              {food.allergens.length === 0 && t('foodDetails.noAllergens')}
              {food.allergens.map((allergen, index) => (
                <span key={index}>
                  {allergen.name.value} (<FontAwesomeIcon icon={iconMap[allergen.iconName]} />)
                </span>
              ))}
            </div>
          </div>
          <div className='food-details-actions'>
            <div className="food-details-price">
              {food.price && formatPrice(food.price.amount, food.price.currency)}
            </div>
            <AddToCartButton foodId={Number(foodId)} classNameAddOns='food-details-page'/>
          </div>
        </div>
      </div>
    </section>
  )
}
