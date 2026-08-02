import React, { useEffect, useState } from 'react'
import { FIRSTNAME_VALUE_ALLOWED_REGEX, FIRSTNAME_VALUE_MAX_LENGTH, FIRSTNAME_VALUE_MIN_LENGTH } from '../../../../utils/customer/FirstnameUtils'
import { FirstnameModel } from '../../../../model/customer/FirstnameModel'
import { getErrorMessages, DisplayErrors } from '../../../../utils/ErrorUtils'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface FirstnameInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FirstnameInput: React.FC<FirstnameInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string[] | string>('')
  const location = useLocation()
  
  useEffect(() => {
    if (!value) {
      setError('')
      return
    }
    
    const validationTimeout = setTimeout(() => {
      try {
        new FirstnameModel(value)
        setError('')
      } catch (e) {
        setError(getErrorMessages(e))
      }
    }, 500)

    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className={`${location.pathname === '/checkout' ? 'form-label checkout' : 'form-label'}`}>
      <div>
        {t('inputs.firstnameLabel')}
        <span className='form-required-indicator'>*</span>
      </div>
      <input
        aria-describedby="firstname-error"
        aria-invalid={ !!error }
        className="form-input"
        inputMode="text"
        maxLength={FIRSTNAME_VALUE_MAX_LENGTH}
        minLength={FIRSTNAME_VALUE_MIN_LENGTH}
        name="firstname"
        onChange={onChange}
        onInput={e => (e.currentTarget.setCustomValidity(''))}
        onInvalid={e => {
          if (Array.isArray(error)) {
            e.currentTarget.setCustomValidity(error.join('\n'))
          } else {
            e.currentTarget.setCustomValidity(error)
          }
        }}
        pattern={FIRSTNAME_VALUE_ALLOWED_REGEX.source}
        required
        spellCheck={false}
        type="text"
        value={value}
      />
      <span id="firstname-error" className="error-message" aria-live="polite">
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}