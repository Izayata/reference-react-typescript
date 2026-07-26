import { Dispatch, SetStateAction, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Modal } from '../../../functional/Modal/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import './css/logout-icon.css'
import './css/logout-button-nav-link-wrapper.css'

interface LogoutButtonProps {
  onLogout: () => void
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  
  const [modalMessage, setModalMessage] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      const csrfResponse = await fetch('/csrf-token', {
        credentials: 'include', 
      })

      if (!csrfResponse.ok) {
        throw new Error('Szerver hiba! Próbálja újra később!')
      }

      const csrfData = await csrfResponse.json()

      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          _csrf: csrfData.csrfToken
        }).toString(),
        credentials: 'include',
      })
  
      if (response.ok) {
        // const data = await response.json()
        // console.log(data.message)
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
