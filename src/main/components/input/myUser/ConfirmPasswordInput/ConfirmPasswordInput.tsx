import React, { useEffect, useState } from 'react'
import { InputFieldCheckmark } from '../InputFieldCheckmark/InputFieldCheckmark'
import { InputFieldXmark } from '../InputFieldXmark/InputFieldXmark'

interface ConfirmPasswordInputProps {
  value: string
  originalPassword: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ConfirmPasswordInput: React.FC<ConfirmPasswordInputProps> = ({ value, originalPassword, onChange }) => {
  const [error, setError] = useState<string>('')
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    if (!value) {
      setError('')
      return
    }

  }, [value])
  
  useEffect(() => {
    if (!value) {
      setError('')
      return
    }

    const validationTimeout = setTimeout(() => {
      try {
        if (value && value !== originalPassword) {
          throw new Error('A jelszavak nem egyeznek!')
        }
        setAllowed(true)
        setError('')
      } catch (e: unknown) {
        setAllowed(false)
        setError(e instanceof Error ? e.message : String(e))
      }
    }, 1000)

    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className="form-label">
      <div>
        Jelszó újra:
        <span className='form-required-indicator'>*</span>
      </div>
      <div className="registration-form-input-wrapper">
        <input
          type="password"
          className="form-input"
          name="confirmPassword"
          value={value}
          onChange={
            (e) => {
              if (error !== '') setError('')
              onChange(e)
            }
          }
          required
          aria-describedby="confirm-password-error"
          aria-invalid={!!error}
          onInvalid={e => {
            if (e.currentTarget.validity.valueMissing) {
              e.currentTarget.setCustomValidity('A mező kitöltése kötelező!')
            } else {
              e.currentTarget.setCustomValidity(error)
            }
          }}
          onInput={e => (e.currentTarget.setCustomValidity(''))}
        />
        {value && !error && allowed && (
          <InputFieldCheckmark/>
        )}
        {value && error && !allowed && (
          <InputFieldXmark/>
        )}
      </div>
      <span id="confirm-password-error" className="error-message" aria-live="polite">
        { error === '' ? '' : <li>{error}</li> }
      </span>
    </label>
  )
}
