import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './css/login-icon.css'
import './css/login-button-nav-link-wrapper.css'

export function LoginButton() {
  const { t } = useTranslation()

  return (
    <NavLink
      to="/login"
      className={
        ({isActive}) => `login-button-nav-link-wrapper ${isActive ? 'active' : ''}`
      }
      aria-label={t('nav.loginLinkAriaLabel')}
    >
      <FontAwesomeIcon
        icon={faArrowRightToBracket}
        className='login-icon'
      />
    </NavLink>
  )
}