import React, { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { countryLocalization, PHONE_NUMBER_VALUE_ALLOWED_REGEX } from '../../../../utils/customer/PhoneNumberUtils'
import { PhoneNumberModel } from '../../../../model/customer/PhoneNumberModel'
import { DisplayErrors, getErrorMessages } from '../../../../utils/ErrorUtils'
import './css/phone-number-input.css'
import { useLocation } from 'react-router-dom'

interface PhoneNumberInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({value, onChange }) => {
  const [error, setError] = useState<string[] | string>('')
  const location = useLocation()
    
  useEffect(() => {
    if (!value) {
      setError('')
      return
    }
    
    const validationTimeout = setTimeout(() => {
      try {
        new PhoneNumberModel(value)
        setError('')
      } catch (e: unknown) {
        setError(getErrorMessages(e))
      }
    }, 500)

    return () => clearTimeout(validationTimeout)
  }, [value])

  return (
    <label className={`${location.pathname === '/checkout' ? 'form-label checkout' : 'form-label'}`} htmlFor="phone-number-input">
      <div>
        Telefonszám:
        <span className='form-required-indicator'>*</span>
      </div>
      <PhoneInput
        country={'hu'}
        inputProps={{
          id: 'phone-number-input',
          'aria-describedby': 'phone-number-error',
          'aria-invalid': !!error,
          name: 'phoneNumber',
          onChange,
          onInvalid: (e: React.FormEvent<HTMLInputElement>) => {
            if (Array.isArray(error)) {
              e.currentTarget.setCustomValidity(error.join('\n'))
            } else {
              e.currentTarget.setCustomValidity(error)
            }
          },
          onInput: (e: React.FormEvent<HTMLInputElement>) =>
            (e.currentTarget.setCustomValidity('')),
          pattern: PHONE_NUMBER_VALUE_ALLOWED_REGEX.source,
          required: true,
          type: 'text',
          spellCheck: false
        }}
        inputStyle={{width: '100%'}}
        countryCodeEditable={false}
        autoFormat={false}
        enableSearch={true}
        localization={countryLocalization}
        value={value}
      />
      <span id="phone-number-error" className="error-message" aria-live="polite">
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}