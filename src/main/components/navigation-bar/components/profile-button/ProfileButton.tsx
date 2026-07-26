import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom'
import './css/profile-icon.css'
import './css/profile-button-nav-link-wrapper.css'

export function ProfileButton() {
  return (
    <NavLink
      to='/account'
      className={
        ({ isActive }) => (`profile-button-nav-link-wrapper ${isActive ? 'active' : ''}`)
      }
    >
      <FontAwesomeIcon
        icon={faUser}
        className='profile-icon'
      />
    </NavLink>
  )
}