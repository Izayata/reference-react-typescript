import React from 'react'
import { FLOOR_DOOR_VALUE_ALLOWED_REGEX, FLOOR_DOOR_VALUE_MAX_LENGTH, FLOOR_DOOR_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/FloorDoorUtils'
import { FloorDoorModel } from '../../../../../model/customer/address/FloorDoorModel'
import { DisplayErrors } from '../../../../../utils/ErrorUtils'
import { useDebouncedModelValidation } from '../../../useDebouncedModelValidation'
import { useTranslation } from 'react-i18next'

import '../../../../../css/shared/form/form-label-strong.css'

interface FloorDoorInputProps {
  name:string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FloorDoorInput: React.FC<FloorDoorInputProps> = ({ name, value, onChange }) => {
  const { t } = useTranslation()
  const error = useDebouncedModelValidation(value, FloorDoorModel)

  return (
    <label className="form-label">
      <strong className='form-label-strong'>{t('inputs.floorDoorLabel')}</strong>
      <input
        aria-describedby="floorDoor-error"
        aria-invalid={!!error}
        className="form-input"
        inputMode="text"
        maxLength={FLOOR_DOOR_VALUE_MAX_LENGTH}
        minLength={FLOOR_DOOR_VALUE_MIN_LENGTH}
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
        pattern={FLOOR_DOOR_VALUE_ALLOWED_REGEX.source}
        spellCheck="false"
        type="text"
        value={value}
      />
      <span id="floorDoor-error" className="error-message" aria-live="polite">
        <DisplayErrors error={error} />
      </span>
    </label>
  )
}