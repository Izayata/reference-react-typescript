import React, { useState } from 'react'
import { fetchCsrfToken } from '../../../supports/fetch-utilities/fetchCsrfToken'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../../../css/shared/form/form-container.css'
import '../../../css/shared/form/form-orientation.css'
import '../../../css/shared/form/form-label.css'
import '../../../css/shared/form/form-input.css'
import './css/login-page-nav-link-text.css'
import './css/login-page-registration-span.css'
// import './Login.css'
import '../../../css/shared/button/application-button-style.css'

interface LoginProps {
  onLogin: () => void,
}

export function Login({ onLogin }: LoginProps) {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { setModalMessage } = useModal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const csrfToken = await fetchCsrfToken()
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password, _csrf: csrfToken }).toString(),
        credentials: 'include',
      })
      if (response.ok || response.status === 302) {
        const data = await response.json()
        onLogin()
        window.location.href = data.redirectUrl
      } else {
        setModalMessage(t('login.invalidCredentials'))
      }
    } catch (err) {
      setModalMessage(t('login.genericError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className='form-container'>
        <form className='form-orientation' onSubmit={handleSubmit}>
          <label className='form-label'>
            {t('login.usernameLabel')}
            <input
              type="text"
              className='form-input'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </label>
          <label className='form-label'>
            {t('login.passwordLabel')}
            <input
              type="password"
              className='form-input'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <NavLink
              to="/forgot-password"
              className='login-page-nav-link-text'
            >
              {t('login.forgotPassword')}
            </NavLink>
          </label>
          <button
            type="submit"
            className='application-button-style'
          >
            {t('login.submitButton')}
          </button>
        </form>
        <span className='login-page-registration-span'>
          {t('login.noAccountYet')}
          <NavLink
            to="/register"
            className='login-page-nav-link-text'
            style={{
              marginRight: 'auto',
            }}
          >
            {t('login.registerHere')}
          </NavLink>
        </span>
      </div>
    </>
  )
}
