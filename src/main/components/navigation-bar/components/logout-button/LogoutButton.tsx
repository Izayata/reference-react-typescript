import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Modal } from '../../../functional/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import './css/logout-icon.css'
import './css/logout-button-nav-link-wrapper.css'
import { fetchCsrfToken } from '../../../../supports/fetch-utilities/fetchCsrfToken'

interface LogoutButtonProps {
  onLogout: () => void
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {

  const [modalMessage, setModalMessage] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': await fetchCsrfToken()
        },
        credentials: 'include',
      })
  
      if (response.ok) {
        onLogout()
      } else {
        throw new Error('Kijelentkezés sikertelen!')
      }
    } catch (err) {
      setModalMessage(String(err))
    }
  }

  return (
    <>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}
      <NavLink
        to=""
        className={'logout-button-nav-link-wrapper'}
        onClick={handleLogout}
      >
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          className='logout-icon'
        />
      </NavLink>
    </>
  )
}
