import React, { useEffect, useState } from 'react'
import { LASTNAME_VALUE_ALLOWED_REGEX, LASTNAME_VALUE_MAX_LENGTH, LASTNAME_VALUE_MIN_LENGTH } from '../../../../utils/customer/LastnameUtils'
import { LastnameModel } from '../../../../model/customer/LastnameModel'
import { getErrorMessages, DisplayErrors } from '../../../../utils/ErrorUtils'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface LastnameInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const LastnameInput: React.FC<LastnameInputProps> = ({ value, onChange }) => {
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
        new LastnameModel(value)
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
        {t('inputs.lastnameLabel')}
        <span className='form-required-indicator'>*</span>
      </div>
      <input
        aria-describedby="lastname-error"
        aria-invalid={!!error}
        className="form-input"
        inputMode="text"
        name="lastname"
        maxLength={LASTNAME_VALUE_MAX_LENGTH}
        minLength={LASTNAME_VALUE_MIN_LENGTH}
        onChange={onChange}
        onInput={e => (e.currentTarget.setCustomValidity(''))}
        onInvalid={e => {
          if (Array.isArray(error)) {
            e.currentTarget.setCustomValidity(error.join('\n'))
          } else {
            e.currentTarget.setCustomValidity(error)
          }
        }}
        pattern={LASTNAME_VALUE_ALLOWED_REGEX.source}
        required
        spellCheck={false}
        type="text"
        value={value}
      />
      <span id="lastname-error" className="error-message" aria-live="polite">
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}