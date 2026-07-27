import React, { useEffect, useState } from 'react'
import { CITY_VALUE_ALLOWED_REGEX, CITY_VALUE_MAX_LENGTH, CITY_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/CityUtils'
import { CityModel } from '../../../../../model/customer/address/CityModel'
import { ValidationError } from 'class-validator'
import { useTranslation } from 'react-i18next'

import '../../../../../css/shared/form/form-label-strong.css'

interface CityInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const CityInput: React.FC<CityInputProps> = ({ name, value, onChange }) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string[] | string>('')

  useEffect(() => {
    if (!value) {
      setError('')
      return
    }
    
    const validationTimeout = setTimeout(() => {
      try {
        new CityModel(value)
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
    <label className='form-label'>
      <div>
        <strong className='form-label-strong'>{t('inputs.cityLabel')}</strong>
        <span className='form-required-indicator'>*</span>
      </div>
      <input
        aria-describedby="city-error"
        aria-invalid={!!error}
        className="form-input"
        inputMode="text"
        maxLength={CITY_VALUE_MAX_LENGTH}
        minLength={CITY_VALUE_MIN_LENGTH}
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
        pattern={CITY_VALUE_ALLOWED_REGEX.source}
        required
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="city-error" className="error-message" aria-live="polite">
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