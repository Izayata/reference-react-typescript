import React, { useEffect, useState } from 'react'
import { PASSWORD_VALUE_ALLOWED_REGEX, PASSWORD_VALUE_MAX_LENGTH, PASSWORD_VALUE_MIN_LENGTH } from '../../../../utils/myUser/PasswordUtils'
import { PasswordModel } from '../../../../model/myUser/PasswordModel'
import { ValidationError } from 'class-validator'
import { InputFieldCheckmark } from '../InputFieldCheckmark/InputFieldCheckmark'
import { InputFieldXmark } from '../InputFieldXmark/InputFieldXmark'
import '../../../../css/shared/form/form-label-strong.css'

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  label: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, name, label }) => {
  const [error, setError] = useState<string[] | string>('')
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
        new PasswordModel(value)
        setAllowed(true)
        setError('')
      } catch (e: unknown) {
        const messages: string[] = []
        if (Array.isArray(e)) {
          e.forEach((err: ValidationError) => {
            if (err.constraints) {
              messages.push(...Object.values(err.constraints))
            }
          })
        }
        setAllowed(false)
        setError(messages)
      }
    }, 1000)
  
    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className="form-label">
      <div>
        <strong className='form-label-strong'>{label}</strong>
        <span className='form-required-indicator'>*</span>
      </div>
      <div className="registration-form-input-wrapper">
        <input
          aria-describedby="password-error"
          aria-invalid={!!error}
          autoComplete="password"
          className="form-input"
          type="password"
          inputMode="text"
          maxLength={PASSWORD_VALUE_MAX_LENGTH}
          minLength={PASSWORD_VALUE_MIN_LENGTH}
          name={name}
          onChange={
            (e) => {
              if (error !== '') setError('')
              onChange(e)
            }
          }
          onInput={e => (e.currentTarget.setCustomValidity(''))}
          onInvalid={e => {
            if (Array.isArray(error)) {
              e.currentTarget.setCustomValidity(error.join('\n'))
            } else {
              e.currentTarget.setCustomValidity(error)
            }
          }}
          pattern={PASSWORD_VALUE_ALLOWED_REGEX.source}
          required
          spellCheck={false}
          value={value}
        />
        {value && !error && allowed && (
          <InputFieldCheckmark/>
        )}
        {value && error && !allowed && (
          <InputFieldXmark/>
        )}
      </div>
      <span id="password-error" className="error-message" aria-live="polite">
        {Array.isArray(error)
          ? error.map((msg, idx) => (
            <li key = {idx}>{msg}</li>
          )) 
          : error === '' ? '' :<li>{error}</li>
        }
      </span>
    </label>
  )
}