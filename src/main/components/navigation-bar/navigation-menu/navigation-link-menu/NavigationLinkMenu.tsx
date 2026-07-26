import { NavLink } from 'react-router-dom'
import { SeparatorLine } from './separator-line/SeparatorLine'
import './css/navigation-link-menu.css'
import '../../../../css/shared/navigation-link.css'
import '../../../../css/container/navigation-link-container.css'

export function NavigationLinkMenu() {
  return (
    <div className='navigation-link-menu'>
      <div className='navigation-link-container'>
        <NavLink
          className={
            ({isActive}) => `navigation-link button-scale ${isActive ? 'active' : ''}`
          }
          to='/menu_page'
          style={{
            paddingTop: '.25rem',
            paddingBottom: '.25rem',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}
        >
          Étlap
        </NavLink>
        <SeparatorLine />
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
          Allergének
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
          Galéria
        </NavLink>
        <SeparatorLine />
        <NavLink
          className={
            ({isActive}) => `navigation-link button-scale ${isActive ? 'active' : ''}`
          }
          to='/contact'
          style={{
            paddingTop: '.25rem',
            paddingBottom: '.25rem',
            fontSize: '1.2rem',
            fontWeight: '600',
          }}
        >
          Kapcsolat
        </NavLink>
      </div>
    </div>
  )
}