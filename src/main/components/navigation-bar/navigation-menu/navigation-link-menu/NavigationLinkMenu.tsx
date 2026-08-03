import { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SeparatorLine } from './separator-line/SeparatorLine'
import { MENU_CATEGORIES } from '../../../../utils/pages/menu/menuPageUtils'
import { useActiveMenuCategory } from '../../../../context/ActiveMenuCategoryContext/ActiveMenuCategoryContext'
import './NavigationLinkMenu.css'
import '../../../../css/shared/navigation-link.css'
import '../../../../css/container/navigation-link-container.css'

export function NavigationLinkMenu() {
  const { t } = useTranslation()
  const { activeMenuCategory } = useActiveMenuCategory()

  return (
    <div className='navigation-link-menu'>
      <div className='navigation-link-container'>
        {MENU_CATEGORIES.map(({ category, slug, i18nKey }) => {
          const isActive = activeMenuCategory === slug
          return (
            <Fragment key={category}>
              <Link
                className={`navigation-link button-scale ${isActive ? 'active' : ''}`}
                to={`/menu_page?category=${slug}`}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  paddingTop: '.25rem',
                  paddingBottom: '.25rem',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                }}
              >
                {t(i18nKey)}
              </Link>
              <SeparatorLine />
            </Fragment>
          )
        })}
        <NavLink
          className={
            ({isActive}) => `navigation-link button-scale ${isActive ? 'active' : ''}`
          }
          to='/allergens'
          style={{
            paddingTop: '.25rem',
            paddingBottom: '.25rem',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}
        >
          {t('nav.allergens')}
        </NavLink>
        <SeparatorLine />
        <NavLink
          className={
            ({isActive}) => `navigation-link button-scale ${isActive ? 'active' : ''}`
          }
          to='/gallery'
          style={{
            paddingTop: '.25rem',
            paddingBottom: '.25rem',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}
        >
          {t('nav.gallery')}
        </NavLink>
        <SeparatorLine />
        <a
          className='navigation-link button-scale'
          href='#contact'
          style={{
            paddingTop: '.25rem',
            paddingBottom: '.25rem',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}
        >
          {t('nav.contact')}
        </a>
      </div>
    </div>
  )
}