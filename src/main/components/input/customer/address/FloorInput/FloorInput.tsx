import React from 'react'
import { FLOOR_VALUE_ALLOWED_REGEX, FLOOR_VALUE_MAX_LENGTH, FLOOR_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/FloorUtils'
import { FloorModel } from '../../../../../model/customer/address/FloorModel'
import { DisplayErrors } from '../../../../../utils/ErrorUtils'
import { useDebouncedModelValidation } from '../../../useDebouncedModelValidation'
import { useTranslation } from 'react-i18next'

import '../../../../../css/shared/form/form-label-strong.css'

interface FloorInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FloorInput: React.FC<FloorInputProps> = ({ name, value, onChange }) => {
  const { t } = useTranslation()
  const error = useDebouncedModelValidation(value, FloorModel)

  return (
    <label className="form-label">
      <strong className='form-label-strong'>{t('inputs.floorLabel')}</strong>
      <input
        aria-describedby="floor-error"
        aria-invalid={!!error}
        className="form-input"
        inputMode="text"
        maxLength={FLOOR_VALUE_MAX_LENGTH}
        minLength={FLOOR_VALUE_MIN_LENGTH}
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
        pattern={FLOOR_VALUE_ALLOWED_REGEX.source}
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="floor-error" className="error-message" aria-live="polite">
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}
