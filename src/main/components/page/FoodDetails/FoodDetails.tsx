import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FoodDetailsModel } from '../../../model/FoodDetailsModel'
import { AddToCartButton } from '../../functional/AddToCartButton/AddToCartButton'
import { MenuItemImage } from '../Menu/MenuItemImage/MenuItemImage'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'

import './FoodDetails.css'

import { formatPrice } from '../Menu/Menu'
import { iconMap } from '../Menu/Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function FoodDetails() {
  const { t } = useTranslation()
  const { foodId } = useParams<{ foodId: string }>()
  const [food, setFood] = useState<FoodDetailsModel | null>(null)
  const [loading, setLoading] = useState(true)
  const { setModalMessage } = useModal()

  useEffect(() => {
    if (!foodId) {
      setModalMessage(t('foodDetails.missingFoodId'))
      setLoading(false)
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

  if (loading) return <LoadingOverlay />

  if (!food) return null

  return (
    <section className='food-details-container'>
      <h1 className="page-title">{food.foodName.value}</h1>
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
