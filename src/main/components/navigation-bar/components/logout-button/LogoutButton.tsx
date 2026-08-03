import { useState } from 'react'
import { Modal } from '../../../functional/Modal/Modal'
import { useTranslation } from 'react-i18next'
import './LogoutButton.css'
import { fetchCsrfToken } from '../../../../supports/fetch-utilities/fetchCsrfToken'
import { handleErrorMessages } from '../../../../utils/ErrorUtils'

interface LogoutButtonProps {
  onLogout: () => void
  className?: string
  style?: React.CSSProperties
}

export function LogoutButton({
  onLogout,
  className = 'logout-button-nav-link-wrapper',
  style
}: LogoutButtonProps) {
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
      <button
        type="button"
        className={className}
        style={style}
        onClick={handleLogout}
      >
        {t('nav.logout')}
      </button>
    </>
  )
}
