import React, { useEffect, useState } from 'react'
import { STREET_VALUE_ALLOWED_REGEX, STREET_VALUE_MAX_LENGTH, STREET_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/StreetUtils'
import { StreetModel } from '../../../../../model/customer/address/StreetModel'
import { ValidationError } from 'class-validator'

import '../../../../../css/shared/form/form-label-strong.css'

interface StreetInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const StreetInput: React.FC<StreetInputProps> = ({ name, value, onChange }) => {
  const [error, setError] = useState<string[] | string>('')
  
  useEffect(() => {
    if (!value) {
      setError('')
      return
    }
    
    const validationTimeout = setTimeout(() => {
      try {
        new StreetModel(value)
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
        setError(messages)
      }
    }, 500)

    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className="form-label" >
      <div>
        <strong className='form-label-strong'>Közterület:</strong>
        <span className='form-required-indicator'>*</span>
      </div>
      <input
        aria-describedby="street-error"
        aria-invalid={!!error}
        inputMode="text"
        className="form-input"
        maxLength={STREET_VALUE_MAX_LENGTH}
        minLength={STREET_VALUE_MIN_LENGTH}
        name={name}
        onChange={onChange}
        onInput={e => (e.currentTarget.setCustomValidity(''))}
        onInvalid={e => {
          if (Array.isArray(error)) {
            e.currentTarget.setCustomValidity(error.join('\n'))
          } else {
            e.currentTarget.setCustomValidity(error)
          }
        }}
        pattern={STREET_VALUE_ALLOWED_REGEX.source}
        required
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="street-error" className="error-message" aria-live="polite">
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