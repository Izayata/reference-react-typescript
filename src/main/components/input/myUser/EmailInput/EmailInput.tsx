import React, { useEffect, useState } from 'react'
import { InputFieldCheckmark } from '../InputFieldCheckmark/InputFieldCheckmark'
import { InputFieldXmark } from '../InputFieldXmark/InputFieldXmark'
import { checkEmailExists, EMAIL_VALUE_ALLOWED_REGEX, EMAIL_VALUE_MAX_LENGTH, ERR_MSG_EMAIL_VALUE_EXISTS } from '../../../../utils/EmailUtils'
import { EmailModel } from '../../../../model/EmailModel'
import { ValidationError } from 'class-validator'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


interface EmailInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string[] | string>('')
  const [isAvailable, setAvailable] = useState<null | boolean>(null)
  const location = useLocation()

  useEffect(() => {
    if (!value) {
      setError('')
      setAvailable(null)
      return
    }

  }, [value])

  useEffect(() => {
    if (!value) {
      setError('')
      setAvailable(null)
      return
    }

    let cancelled = false
    let availabilityTimeout: ReturnType<typeof setTimeout> | undefined

    const validationTimeout = setTimeout(() => {
      try {
        new EmailModel(value)
        setError('')
        availabilityTimeout = setTimeout(async () => {
          try {
            const exists = await checkEmailExists(value)
            if (cancelled) return
            setAvailable(!exists)
            if (exists) setError(ERR_MSG_EMAIL_VALUE_EXISTS)
          } catch (availabilityError: unknown) {
            if (cancelled) return
            setAvailable(null)
            setError(availabilityError instanceof Error ? availabilityError.message : String(availabilityError))
          }
        }, 150)
      } catch (e: unknown) {
        const messages: string[] = []
        if (Array.isArray(e)) {
          e.forEach((err: ValidationError) => {
            if (err.constraints) {
              messages.push(...Object.values(err.constraints))
            }
          })
        }
        setError(messages)
        setAvailable(null)
      }
    }, 1000)

    return () => {
      cancelled = true
      clearTimeout(validationTimeout)
      clearTimeout(availabilityTimeout)
    }
  }, [value])

  return (
    <label className={`${location.pathname === '/checkout' ? 'form-label checkout' : 'form-label'}`}>
      <div>
        e-Mail:
        <span className='form-required-indicator'>*</span>
      </div>
      <div className="registration-form-input-wrapper">
        <input
          style={location.pathname === '/checkout' ? {width: '100%'} : {}}
          aria-busy={isAvailable === null && !!value}
          aria-describedby="email-error"
          aria-invalid={!!error}
          className="form-input"
          inputMode="text"
          max={EMAIL_VALUE_MAX_LENGTH}
          min={1}
          name="email"
          onChange={
            (e) => {
              if (error !== '') setError('')
              if (isAvailable !== null) setAvailable(null)
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
          pattern={EMAIL_VALUE_ALLOWED_REGEX.source}
          required
          spellCheck={false}
          type="text"
          value={value}
        />
        {value && !error && isAvailable === true && (
          <InputFieldCheckmark ariaLabel={t('inputs.emailAvailableAriaLabel')}/>
        )}
        {value && (error || isAvailable === false) && (
          <InputFieldXmark ariaLabel={t('inputs.emailUnavailableAriaLabel')}/>
        )}
      </div>
      <span id="email-error" className="error-message" aria-live="polite">
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