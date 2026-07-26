import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import './css/login-icon.css'
import './css/login-button-nav-link-wrapper.css'

export function LoginButton() {
  return (
    <NavLink
      to="/login"
      className={
        ({isActive}) => `login-button-nav-link-wrapper ${isActive ? 'active' : ''}`
      }
    >
      <FontAwesomeIcon
        icon={faArrowRightToBracket}
        className='login-icon'
      />
    </NavLink>
  )
}