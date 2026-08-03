import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './LoginButton.css'

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
      <span className='login-button-label'>{t('nav.login')}</span>
    </NavLink>
  )
}