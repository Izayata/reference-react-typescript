import { Fragment } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SeparatorLine } from './separator-line/SeparatorLine'
import { MENU_CATEGORIES } from '../../../../utils/pages/menu/menuPageUtils'
import { useActiveMenuCategory } from '../../../../context/ActiveMenuCategoryContext/ActiveMenuCategoryContext'
import { ProfileButton } from '../../components/profile-button/ProfileButton'
import { LogoutButton } from '../../components/logout-button/LogoutButton'
import { OrdersButton } from '../../components/orders-button/OrdersButton'
import './NavigationLinkMenu.css'
import '../../../../css/shared/navigation-link.css'
import '../../../../css/container/navigation-link-container.css'
import '../../../../css/shared/hidden-from-desktop-landscape.css'
import '../../../../css/shared/visible-from-desktop-landscape.css'

interface NavigationLinkMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const drawerLinkStyle = {
  paddingTop: '.25rem',
  paddingBottom: '.25rem',
  fontWeight: '600',
}

export function NavigationLinkMenu({ isAuthenticated, onLogout }: NavigationLinkMenuProps) {
  const { t } = useTranslation()
  const { activeMenuCategory } = useActiveMenuCategory()

  return (
    <div className='navigation-link-menu'>
      <div className='navigation-link-container'>
        <span className='hidden-from-desktop-landscape'>
          <NavLink
            className={
              ({isActive}) => `navigation-link button-scale ${isActive ? 'active' : ''}`
            }
            to='/'
            end
            style={drawerLinkStyle}
          >
            {t('nav.home')}
          </NavLink>
          <SeparatorLine />
        </span>
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
            fontWeight: '600',
          }}
        >
          {t('nav.contact')}
        </a>
        {isAuthenticated && (
          <span className='visible-from-desktop-landscape'>
            <SeparatorLine />
            <OrdersButton
              className='navigation-link button-scale'
              style={drawerLinkStyle}
            />
          </span>
        )}
        {isAuthenticated && (
          <span className='hidden-from-desktop-landscape'>
            <SeparatorLine />
            <ProfileButton
              asText
              className='navigation-link button-scale'
              style={drawerLinkStyle}
            />
            <SeparatorLine />
            <OrdersButton
              className='navigation-link button-scale'
              style={drawerLinkStyle}
            />
            <SeparatorLine />
            <LogoutButton
              onLogout={onLogout}
              className='navigation-link button-scale'
              style={drawerLinkStyle}
            />
          </span>
        )}
      </div>
    </div>
  )
}