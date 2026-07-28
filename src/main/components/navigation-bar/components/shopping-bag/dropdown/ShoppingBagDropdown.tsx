import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../../../../../css/container/navigation-link-container.css'
import './css/shopping-bag-dropdown.css'
import '../../../../../css/shared/navigation-link.css'

export function ShoppingBagDropdown({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation()

  return (
    // onClick here only catches the bubbled click from the NavLinks below (to close
    // the dropdown after navigating); those links are already keyboard-operable on
    // their own, including triggering this bubble via Enter, so this wrapper itself
    // doesn't need to be a separate tab stop.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div id="shopping-bag-dropdown" className='shopping-bag-dropdown navigation-link-container' onClick={onClick}>
      <NavLink className='navigation-link shopping-bag-link' to='/cart'>{t('nav.cart')}</NavLink>
      <div style={{
        width: '100%',
        border: '1px solid #695A3D'
      }}/>
      <NavLink className='navigation-link shopping-bag-link' to='/checkout'>{t('nav.checkout')}</NavLink>
    </div>
  )
}