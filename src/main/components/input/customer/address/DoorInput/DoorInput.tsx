import React from 'react'
import { DOOR_VALUE_ALLOWED_REGEX, DOOR_VALUE_MAX_LENGTH, DOOR_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/DoorUtils'
import { DoorModel } from '../../../../../model/customer/address/DoorModel'
import { DisplayErrors } from '../../../../../utils/ErrorUtils'
import { useDebouncedModelValidation } from '../../../useDebouncedModelValidation'
import { useTranslation } from 'react-i18next'

import '../../../../../css/shared/form/form-label-strong.css'

interface DoorInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

export const DoorInput: React.FC<DoorInputProps> = ({ name, value, onChange, disabled }) => {
  const { t } = useTranslation()
  const error = useDebouncedModelValidation(value, DoorModel)

  return (
    <label className="form-label">
      <strong className='form-label-strong'>{t('inputs.doorLabel')}</strong>
      <input
        aria-describedby="door-error"
        aria-invalid={!!error}
        className="form-input"
        disabled={disabled}
        inputMode="text"
        maxLength={DOOR_VALUE_MAX_LENGTH}
        minLength={DOOR_VALUE_MIN_LENGTH}
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
        pattern={DOOR_VALUE_ALLOWED_REGEX.source}
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="door-error" className="error-message" aria-live="polite">
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}
