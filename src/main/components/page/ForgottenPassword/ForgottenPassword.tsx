import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchCsrfToken } from '../../../supports/fetch-utilities/fetchCsrfToken'
import { EmailModel } from '../../../model/EmailModel'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { ForgottenPasswordRequestModel } from '../../../model/ForgottenPasswordRequestModel'
import { UsernameModel } from '../../../model/myUser/UsernameModel'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { PasswordModel } from '../../../model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../../../model/NewPasswordDetailsModel'
import { toast } from 'react-toastify'
import { PasswordInput } from '../../input/myUser/PasswordInput/PasswordInput'
import { ConfirmPasswordInput } from '../../input/myUser/ConfirmPasswordInput/ConfirmPasswordInput'
import { ResetPasswordRequestModel } from '../../../model/ResetPasswordRequestModel'
import { sleep } from '../../../utils/sleep/SleepUtils'

export function ForgottenPassword() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { setModalMessage } = useModal()
  const [step, setStep] = useState<'email' | 'sent' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [searchParams] = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const navigate = useNavigate()

  // Check if reset token is present in URL
  const resetToken = searchParams.get('token')

  // If token exists, show reset form
  useEffect(() => {
    if (resetToken) {
      validateResetToken(resetToken)
    }
  }, [resetToken])

  // 1. Request password reset
  const requestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const payload = new ForgottenPasswordRequestModel(new EmailModel(email), new UsernameModel(username))
      const response = await fetch('/v1/password-reset/request-password-reset-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': await fetchCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setStep('sent')
      } else {
        const errorData = await response.json()
        setModalMessage(errorData.error || t('forgottenPassword.emailSendError'))
      }
    } catch (err) {
      setModalMessage(t('forgottenPassword.unknownError'))
    } finally {
      setLoading(false)
    }
  }

  // 2. Validate reset token
  const validateResetToken = async (token: string) => {
    setLoading(true)
    await sleep(1000)
    
    try {
      const response = await fetch(`/v1/password-reset/validate?token=${encodeURIComponent(token)}`, {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()
      
      if (data.valid) {
        setStep('reset')
      } else if (data.expired) {
        setModalMessage(t('forgottenPassword.linkExpired'))
        setStep('email')
      } else {
        setModalMessage(t('forgottenPassword.linkInvalid'))
        setStep('email')
      }
    } catch (err) {
      setModalMessage(t('forgottenPassword.tokenValidationError'))
      setStep('email')
    } finally {
      setLoading(false)
    }
  }

  // 3. Reset password
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!resetToken) {
        setStep('email')
        setLoading(false)
        setModalMessage(t('forgottenPassword.tokenMissing'))
        return
      }

      const newPasswordDetailsModel = new NewPasswordDetailsModel(new PasswordModel(newPassword), new PasswordModel(confirmNewPassword))
      const payload = new ResetPasswordRequestModel(resetToken, newPasswordDetailsModel)

      const response = await fetch('/v1/password-reset/set-new-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': await fetchCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify(
          payload
        )
      })
      
      if (response.ok) {
        toast.success(t('forgottenPassword.passwordChangedSuccess'))
        navigate('/login')
      } else {
        const errorData = await response.json()
        setModalMessage(errorData.error || t('forgottenPassword.passwordChangeError'))
      }
    } catch (err: unknown) {
      setModalMessage(err instanceof Error ? err.message : t('forgottenPassword.unknownError'))
    } finally {
      sleep(500)
      setLoading(false)
    }
  }
  
  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="form-container">
        {step === 'email' && (
          <form className='form-orientation' onSubmit={requestPasswordReset}>
            <label className='form-label'>
              {t('forgottenPassword.usernameLabel')}
              <input
                type="text"
                className='form-input'
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </label>
            <label className='form-label'>
              {t('forgottenPassword.emailLabel')}
              <input
                type="email"
                className='form-input'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
            <button
              className='application-button-style'
              type="submit"
            >
              {t('forgottenPassword.requestResetButton')}
            </button>
          </form>
        )}

        {step === 'sent' && (
          <>
            <h2>{t('forgottenPassword.linkSentTitle')}</h2>
            <h3>{t('forgottenPassword.checkSpamSubtitle')}</h3>
            <button
              className='application-button-style'
              onClick={
                () => {
                  setUsername('')
                  setEmail('')
                  setStep('email')
                }
              }
            >
              {t('forgottenPassword.backButton')}
            </button>
          </>
        )}

        {step === 'reset' && (
          <form className='form-orientation' onSubmit={resetPassword}>
            <PasswordInput
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              name="password"
              label={t('forgottenPassword.newPasswordLabel')}
            />
            <ConfirmPasswordInput
              value={confirmNewPassword}
              originalPassword={newPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
            />
            <button
              className='application-button-style'
              type="submit"
            >
              {t('forgottenPassword.setNewPasswordButton')}
            </button>
          </form>
        )}
      </div>
    </>
      
  )
}