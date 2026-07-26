import React, { useEffect, useState } from 'react'
import { STREET_NUMBER_VALUE_ALLOWED_REGEX, STREET_NUMBER_VALUE_MAX_LENGTH, STREET_NUMBER_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/StreetNumberUtils'
import { StreetNumberModel } from '../../../../../model/customer/address/StreetNumberModel'
import { ValidationError } from 'class-validator'

import '../../../../../css/shared/form/form-label-strong.css'

interface StreetNumberInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const StreetNumberInput: React.FC<StreetNumberInputProps> = ({ name, value, onChange }) => {
  const [error, setError] = useState<string[] | string>('')
  
  useEffect(() => {
    if (!value) {
      setError('')
      return
    }
    
    const validationTimeout = setTimeout(() => {
      try {
        new StreetNumberModel(value)
        setError('')
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
      }
    }, 350)

    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className="form-label">
      <div>
        <strong className='form-label-strong'>Házszám:</strong>
        <span className='form-required-indicator'>*</span>
      </div>
      <input
        aria-describedby="streetNumber-error"
        aria-invalid={!!error}
        className="form-input"
        inputMode="text"
        maxLength={STREET_NUMBER_VALUE_MAX_LENGTH}
        minLength={STREET_NUMBER_VALUE_MIN_LENGTH}
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
        pattern={STREET_NUMBER_VALUE_ALLOWED_REGEX.source}
        required
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="streetNumber-error" className="error-message" aria-live="polite">
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