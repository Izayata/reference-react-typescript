import React, { useEffect, useState } from 'react'
import { checkUsernameExists, ERR_MSG_USERNAME_VALUE_EXISTS, USERNAME_VALUE_ALLOWED_REGEX, USERNAME_VALUE_MAX_LENGTH, USERNAME_VALUE_MIN_LENGTH } from '../../../../utils/myUser/UsernameUtils'
import { InputFieldCheckmark } from '../InputFieldCheckmark/InputFieldCheckmark'
import { InputFieldXmark } from '../InputFieldXmark/InputFieldXmark'
import { UsernameModel } from '../../../../model/myUser/UsernameModel'
import { ValidationError } from 'class-validator'

interface UsernameInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const UsernameInput: React.FC<UsernameInputProps> = ({ value, onChange}) => {
  const [error, setError] = useState<string[] | string>('')
  const [isAvailable, setAvailable] = useState<null | boolean>(null)

  useEffect(() => {
    if (!value) {
      setError('')
      setAvailable(null)
    }

  }, [value])

  useEffect(() => {
    if (!value) {
      setError('')
      setAvailable(null)
      return
    }

    const validationTimeout = setTimeout(() => {
      try {
        new UsernameModel(value)
        setError('')
        const availabilityTimeout = setTimeout(async () => {
          const exists = await checkUsernameExists(value)
          setAvailable(!exists)
          if (exists) setError(ERR_MSG_USERNAME_VALUE_EXISTS)
        }, 150)
        return () => clearTimeout(availabilityTimeout)
      } catch (e: any) {
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

    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className="form-label">
      <div>
        Felhasználónév:
        <span className='form-required-indicator'>*</span>
      </div>
      <div className='registration-form-input-wrapper'>
        <input
          aria-busy={isAvailable === null && !!value}
          aria-describedby="username-availability"
          aria-invalid={!!error}
          autoComplete="username"
          autoFocus
          className="form-input"
          type="text"
          inputMode="text"
          max={USERNAME_VALUE_MAX_LENGTH}
          min={USERNAME_VALUE_MIN_LENGTH}
          name="username"
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
          pattern={USERNAME_VALUE_ALLOWED_REGEX.source}
          required
          spellCheck={false}
          value={value}
        />
        {value && !error && isAvailable === true && (
          <InputFieldCheckmark/>
        )}
        {value && (error || isAvailable === false) && (
          <InputFieldXmark/>
        )}
      </div>
      <span id="username-error" className="error-message" aria-live="polite">
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
