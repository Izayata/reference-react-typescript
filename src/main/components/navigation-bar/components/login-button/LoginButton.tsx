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
    >
      {t('nav.login')}
    </NavLink>
  )
}