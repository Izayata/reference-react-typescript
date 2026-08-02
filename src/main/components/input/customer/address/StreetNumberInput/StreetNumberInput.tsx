import React, { useEffect, useState } from 'react'
import { STREET_NUMBER_VALUE_ALLOWED_REGEX, STREET_NUMBER_VALUE_MAX_LENGTH, STREET_NUMBER_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/StreetNumberUtils'
import { StreetNumberModel } from '../../../../../model/customer/address/StreetNumberModel'
import { getErrorMessages, DisplayErrors } from '../../../../../utils/ErrorUtils'
import { useTranslation } from 'react-i18next'

import '../../../../../css/shared/form/form-label-strong.css'

interface StreetNumberInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const StreetNumberInput: React.FC<StreetNumberInputProps> = ({ name, value, onChange }) => {
  const { t } = useTranslation()
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
      } catch (e: unknown) {
        setError(getErrorMessages(e))
      }
    }, 350)

    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className="form-label">
      <div>
        <strong className='form-label-strong'>{t('inputs.streetNumberLabel')}</strong>
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
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}