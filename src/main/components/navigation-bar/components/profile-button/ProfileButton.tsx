import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './css/profile-icon.css'
import './css/profile-button-nav-link-wrapper.css'

export function ProfileButton() {
  const { t } = useTranslation()

  return (
    <NavLink
      to='/account'
      className={
        ({ isActive }) => (`profile-button-nav-link-wrapper ${isActive ? 'active' : ''}`)
      }
      aria-label={t('nav.profileLinkAriaLabel')}
    >
      <FontAwesomeIcon
        icon={faUser}
        className='profile-icon'
      />
    </NavLink>
  )
}