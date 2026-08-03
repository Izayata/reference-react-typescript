import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './ProfileButton.css'

interface ProfileButtonProps {
  asText?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ProfileButton({
  asText = false,
  className = 'profile-button-nav-link-wrapper',
  style
}: ProfileButtonProps) {
  const { t } = useTranslation()

  return (
    <NavLink
      to='/account'
      className={
        ({ isActive }) => (`${className} ${isActive ? 'active' : ''}`)
      }
      aria-label={asText ? undefined : t('nav.profileLinkAriaLabel')}
      style={style}
    >
      {asText ? t('nav.profileLink') : (
        <FontAwesomeIcon
          icon={faUser}
          className='profile-icon'
        />
      )}
    </NavLink>
  )
}
