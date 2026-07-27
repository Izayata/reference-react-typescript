import React, { useEffect, useState } from 'react'
import { ZIP_CODE_VALUE_ALLOWED_REGEX, ZIP_CODE_VALUE_LENGTH } from '../../../../../utils/customer/address/ZipCodeUtils'
import { ZipCodeModel } from '../../../../../model/customer/address/ZipCodeModel'
import { ValidationError } from 'class-validator'
import { useTranslation } from 'react-i18next'

import '../../../../../css/shared/form/form-label-strong.css'

interface ZipInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ZipInput: React.FC<ZipInputProps> = ({ name, value, onChange }) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string[] | string>('')
  
  useEffect(() => {
    if (!value) {
      setError('')
      return
    }
    
    const validationTimeout = setTimeout(() => {
      try {
        new ZipCodeModel(value)
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
        <strong className='form-label-strong'>{t('inputs.zipLabel')}</strong>
        <span className='form-required-indicator'>*</span>
      </div>
      <input
        aria-describedby="zip-error"
        aria-invalid={!!error}
        className="form-input"
        inputMode="numeric"
        maxLength={ZIP_CODE_VALUE_LENGTH}
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
        pattern={ZIP_CODE_VALUE_ALLOWED_REGEX.source}
        required
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="zip-error" className="error-message" aria-live="polite">
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