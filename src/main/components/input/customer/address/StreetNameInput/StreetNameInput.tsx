import React from 'react'
import { STREET_NAME_VALUE_ALLOWED_REGEX, STREET_NAME_VALUE_MAX_LENGTH, STREET_NAME_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/StreetNameUtils'
import { StreetNameModel } from '../../../../../model/customer/address/StreetNameModel'
import { DisplayErrors } from '../../../../../utils/ErrorUtils'
import { useDebouncedModelValidation } from '../../../useDebouncedModelValidation'
import { useTranslation } from 'react-i18next'

import '../../../../../css/shared/form/form-label-strong.css'

interface StreetNameInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const StreetNameInput: React.FC<StreetNameInputProps> = ({ name, value, onChange }) => {
  const { t } = useTranslation()
  const error = useDebouncedModelValidation(value, StreetNameModel)

  return (
    <label className="form-label" >
      <div>
        <strong className='form-label-strong'>{t('inputs.streetNameLabel')}</strong>
        <span className='form-required-indicator'>*</span>
      </div>
      <input
        aria-describedby="street-name-error"
        aria-invalid={!!error}
        inputMode="text"
        className="form-input"
        maxLength={STREET_NAME_VALUE_MAX_LENGTH}
        minLength={STREET_NAME_VALUE_MIN_LENGTH}
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
        pattern={STREET_NAME_VALUE_ALLOWED_REGEX.source}
        required
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="street-name-error" className="error-message" aria-live="polite">
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}
