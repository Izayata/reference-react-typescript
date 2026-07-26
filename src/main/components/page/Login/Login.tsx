import React, { useState } from 'react'
import { fetchCsrfToken } from '../../../supports/fetch-utilities/fetchCsrfToken'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { NavLink } from 'react-router-dom'
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
        const errorText = await response.text()
        setModalMessage('Hibás felhasználónév vagy jelszó.')
      }
    } catch (err) {
      setModalMessage('Hiba történt. Kérjük, próbálja újra később.')
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
            Felhasználónév:
            <input
              type="text"
              className='form-input'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </label>
          <label className='form-label'>
            Jelszó:
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
              Elfelejtette jelszavát?
            </NavLink>
          </label>
          <button
            type="submit"
            className='application-button-style'
          >
            Bejelentkezés
          </button>
        </form>
        <span className='login-page-registration-span'>
          Nincs még fiókja?
          <NavLink
            to="/register"
            className='login-page-nav-link-text'
            style={{
              marginRight: 'auto',
            }}
          >
            Regisztráljon itt!
          </NavLink>
        </span>
      </div>
    </>
  )
}
