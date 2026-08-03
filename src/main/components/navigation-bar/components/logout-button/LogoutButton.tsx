import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Modal } from '../../../functional/Modal/Modal'
import { useTranslation } from 'react-i18next'
import './LogoutButton.css'
import { fetchCsrfToken } from '../../../../supports/fetch-utilities/fetchCsrfToken'
import { handleErrorMessages } from '../../../../utils/ErrorUtils'

interface LogoutButtonProps {
  onLogout: () => void
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { t } = useTranslation()

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
        throw new Error(t('nav.logoutFailed'))
      }
    } catch (err: unknown) {
      setModalMessage(handleErrorMessages(err))
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
        {t('nav.logout')}
      </NavLink>
    </>
  )
}
