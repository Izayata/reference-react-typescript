import { useEffect, useRef, useState } from 'react'

import { MenuItemModel } from '../../../model/MenuItemModel'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { AddToCartButton } from '../../functional/AddToCartButton/AddToCartButton'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheatAwn } from '@fortawesome/free-solid-svg-icons'
import { faShrimp } from '@fortawesome/free-solid-svg-icons'
import { faEgg } from '@fortawesome/free-solid-svg-icons'
import { faFish } from '@fortawesome/free-solid-svg-icons'
import { faPlateWheat } from '@fortawesome/free-solid-svg-icons'
import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import { faJar } from '@fortawesome/free-solid-svg-icons'
import { faBowlRice } from '@fortawesome/free-solid-svg-icons'
import { faCarrot } from '@fortawesome/free-solid-svg-icons'
import { faHotdog } from '@fortawesome/free-solid-svg-icons'
import { faLeaf } from '@fortawesome/free-solid-svg-icons'
import { faVolcano } from '@fortawesome/free-solid-svg-icons'
import { faPlantWilt } from '@fortawesome/free-solid-svg-icons'
import { faMound } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

import './css/menu-cards-container.css'
import './css/menu-item-allergens.css'
import './css/menu-item-category-name.css'
import './css/menu-item-details-container.css'
import './css/menu-item-name.css'
import './css/menu-item-name-price-container.css'
import './css/menu-item-price.css'
import './css/menu-items-row.css'
import './css/menu-item-image.css'
import './css/menu-item-image-container.css'
import './css/menu-section.css'
import { NavLink } from 'react-router-dom'
import { MenuItemImage } from './MenuItemImage/MenuItemImage'

interface MenuProps {
  url: string;
}

export const iconMap: { [key: string]: IconProp } = {
  'faWheatAwn': faWheatAwn,
  'faShrimp': faShrimp,
  'faEgg': faEgg,
  'faFish': faFish,
  'faPlateWheat': faPlateWheat,
  'faSeedling': faSeedling,
  'faJar': faJar,
  'faBowlRice': faBowlRice,
  'faCarrot': faCarrot,
  'faHotdog': faHotdog,
  'faLeaf': faLeaf,
  'faVolcano': faVolcano,
  'faPlantWilt': faPlantWilt,
  'faMound': faMound
}

async function fetchMenuItems(url: string) {
  const res = await fetch(url, {
    credentials: 'include'
  })

  if (!res.ok) throw new Error('Hiba történt az étlap elemek lekérésekor.')

  const data = await res.json()
    
  return data as MenuItemModel[]
}

function sortIntoSectionOfFour(array: MenuItemModel[]) {
  const result = []
  for (let i = 0; i < array.length; i += 3) {
    result.push(array.slice(i, i + 3))
  }
  return result
}

export function formatPrice(amount: string, currency: string): string {
  const intAmount = parseInt(Number(amount).toString(), 10)

  const currencyDisplay = currency === 'HUF' ? 'Ft' : currency
  return `${intAmount} ${currencyDisplay}`
}

export function renderSection(sectionTitle: string, menuItems: MenuItemModel[][], printLine = false) {
  let sectionTitlePrintedFlag = false

  return (
    <>
      {menuItems.map((row, rowIdx) => (
        <>
          {!sectionTitlePrintedFlag && (
            <h2 className='page-title'>{sectionTitle}</h2>
          )}
          {!sectionTitlePrintedFlag && (sectionTitlePrintedFlag = true)}
          <section className='menu-section'>
            <div className="menu-items-row" key={rowIdx}>
              {row.map((item, idx) => (
                <div className="menu-item-details-container" key={idx}>
                  <NavLink
                    to={`/food/${item.foodId}`}
                    className='menu-item-image-container'
                  >
                    <MenuItemImage
                      className='menu-item-image'
                      src={item.imageUrl.value}
                      alt={item.foodName.value}
                    />
                  </NavLink>
                  <div
                    style={{
                      width: '100%',
                      border: '1px solid',
                      borderRadius: '5px',
                      borderColor: '#695A3D'
                    }}/>
                  <div className='menu-item-name-price-container'>
                    <span className='menu-item-name'>{item.foodName.value}</span>
                    <span className='menu-item-price'>
                      {item.price && formatPrice(item.price.amount, item.price.currency)}
                    </span>
                  </div>
                  <div className="menu-item-allergens">
                    {item.allergens && item.allergens.length > 0
                      ?
                      <>
                        <br />
                        <span>Allergének: </span>
                        {item.allergens.map((allergen, index) => (
                          <span key={index}>
                            <FontAwesomeIcon
                              icon={iconMap[allergen.iconName]}
                            />
                          </span>
                        ))}
                      </> 
                      : '\u00A0'}
                  </div>
                  <AddToCartButton foodId={item.foodId}/>
                </div>
              ))}
            </div>
          </section>
        </>
      ))}
    </>
  )
}

export function Menu({ url }: MenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItemModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchMenuItems(url)
      .then(setMenuItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if(loading) return <LoadingOverlay />

  const soups = sortIntoSectionOfFour(menuItems.filter(item => item.category === 'SOUPS'))
  const mainDishes = sortIntoSectionOfFour(menuItems.filter(item => item.category === 'MAIN_DISHES'))
  const drinks = sortIntoSectionOfFour(menuItems.filter(item => item.category === 'DRINKS'))
  const desserts = sortIntoSectionOfFour(menuItems.filter(item => item.category === 'DESSERTS'))

  return (
    <div className="menu-cards-container">
      {renderSection('Levesek', soups)}
      {renderSection('Főételek', mainDishes)}
      {renderSection('Üdítők', drinks)}
      {renderSection('Desszertek', desserts)}
    </div>
  )
}
