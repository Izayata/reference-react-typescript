import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/i18n'

import { MenuItemModel } from '../../../model/MenuItemModel'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { AddToCartButton } from '../../functional/AddToCartButton/AddToCartButton'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { useActiveMenuCategory } from '../../../context/ActiveMenuCategoryContext/ActiveMenuCategoryContext'

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

import './Menu.css'
import { NavLink, useSearchParams } from 'react-router-dom'
import { MenuItemImage } from './MenuItemImage/MenuItemImage'
import { MENU_CATEGORIES, findMenuCategoryBySlug, menuCategoryAnchorId } from '../../../utils/pages/menu/menuPageUtils'

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

  if (!res.ok) throw new Error(i18n.t('menu.fetchError'))

  const data = await res.json()
    
  return data as MenuItemModel[]
}

function sortIntoSectionOfFour(array: MenuItemModel[]) {
  const result = []
  for (let i = 0; i < array.length; i += 4) {
    result.push(array.slice(i, i + 4))
  }
  return result
}

export function formatPrice(amount: string, currency: string): string {
  const intAmount = parseInt(Number(amount).toString(), 10)

  const currencyDisplay = currency === 'HUF' ? i18n.t('menu.currencySuffix') : currency
  return `${intAmount} ${currencyDisplay}`
}

export function renderSection(sectionTitle: string, sectionId: string, menuItems: MenuItemModel[][], allergensLabel: string) {
  return (
    <>
      <h2 id={sectionId} className='page-title'>{sectionTitle}</h2>
      {menuItems.map((row, rowIdx) => (
        <section className='menu-section' key={rowIdx}>
          <div className="menu-items-row">
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
                      <span>{allergensLabel}</span>
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
      ))}
    </>
  )
}

export function Menu({ url }: MenuProps) {
  const { t } = useTranslation()
  const [menuItems, setMenuItems] = useState<MenuItemModel[]>([])
  const [loading, setLoading] = useState(true)
  const { setModalMessage } = useModal()
  const { setActiveMenuCategory } = useActiveMenuCategory()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchMenuItems(url)
      .then(setMenuItems)
      .catch(e => setModalMessage(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return

    const categoryConfig = findMenuCategoryBySlug(searchParams.get('category'))
    if (!categoryConfig) return

    const target = document.getElementById(menuCategoryAnchorId(categoryConfig.slug))
    if (!target) return

    // Food images finish loading (and reflow the page) in staggered waves, well after
    // this effect first runs — see MenuItemImage's artificial post-load delay. A single
    // "wait until stable, then scroll once" pass can be fooled by a quiet gap between
    // waves, so after scrolling we re-verify alignment and correct again if a later wave
    // knocked the target out of place.
    const REQUIRED_STABLE_FRAMES = 10
    const SETTLE_GRACE_FRAMES = 30
    const ALIGNMENT_TOLERANCE_PX = 2
    const MAX_FRAMES = 240

    let cancelled = false
    let phase: 'waiting' | 'settling' = 'waiting'
    let lastTop: number | null = null
    let stableFrames = 0
    let settleFrames = 0
    let frameCount = 0
    let hasScrolledOnce = false
    let rafId: number

    const tick = () => {
      if (cancelled) return
      frameCount += 1

      if (frameCount >= MAX_FRAMES) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
        return
      }

      if (phase === 'waiting') {
        const currentTop = target.getBoundingClientRect().top
        stableFrames = lastTop !== null && Math.abs(currentTop - lastTop) < 1 ? stableFrames + 1 : 0
        lastTop = currentTop

        if (stableFrames >= REQUIRED_STABLE_FRAMES) {
          target.scrollIntoView({ behavior: hasScrolledOnce ? 'auto' : 'smooth', block: 'start' })
          hasScrolledOnce = true
          phase = 'settling'
          settleFrames = 0
        }
      } else {
        settleFrames += 1
        if (settleFrames >= SETTLE_GRACE_FRAMES) {
          const currentTop = target.getBoundingClientRect().top
          if (Math.abs(currentTop) <= ALIGNMENT_TOLERANCE_PX) return

          phase = 'waiting'
          stableFrames = 0
          lastTop = null
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [loading, searchParams])

  useEffect(() => {
    if (loading) return

    const sections = MENU_CATEGORIES
      .map(({ slug }) => ({ slug, element: document.getElementById(menuCategoryAnchorId(slug)) }))
      .filter((entry): entry is { slug: string; element: HTMLElement } => entry.element !== null)

    if (sections.length === 0) return

    // A section is "current" once its heading has scrolled up to roughly the nav bar's
    // height. Walking sections in page order and taking the last one past that line
    // (rather than watching each heading's own intersection ratio) stays correct even
    // for instant/fast scrolls that jump straight past a heading's brief visible window.
    const ACTIVATION_OFFSET_PX = 120

    let rafId: number | null = null

    const updateActiveSection = () => {
      rafId = null
      let current: string | null = sections[0].slug

      for (const { slug, element } of sections) {
        if (element.getBoundingClientRect().top <= ACTIVATION_OFFSET_PX) {
          current = slug
        } else {
          break
        }
      }

      setActiveMenuCategory(current)
    }

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
      setActiveMenuCategory(null)
    }
  }, [loading, setActiveMenuCategory])

  if(loading) return <LoadingOverlay />

  return (
    <div className="menu-cards-container">
      {MENU_CATEGORIES.map(({ category, slug, i18nKey }) => (
        <Fragment key={category}>
          {renderSection(
            t(i18nKey),
            menuCategoryAnchorId(slug),
            sortIntoSectionOfFour(menuItems.filter(item => item.category === category)),
            t('menu.allergensLabel')
          )}
        </Fragment>
      ))}
    </div>
  )
}
