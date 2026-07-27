import React, { useEffect, useState } from 'react'
import { FLOOR_DOOR_VALUE_ALLOWED_REGEX, FLOOR_DOOR_VALUE_MAX_LENGTH, FLOOR_DOOR_VALUE_MIN_LENGTH } from '../../../../../utils/customer/address/FloorDoorUtils'
import { FloorDoorModel } from '../../../../../model/customer/address/FloorDoorModel'
import { ValidationError } from 'class-validator'

import '../../../../../css/shared/form/form-label-strong.css'

interface FloorDoorInputProps {
  name:string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FloorDoorInput: React.FC<FloorDoorInputProps> = ({ name, value, onChange }) => {
  const [error, setError] = useState<string[] | string>('')
  
  useEffect(() => {
    if (!value) {
      setError('')
      return
    }
    
    const validationTimeout = setTimeout(() => {
      try {
        new FloorDoorModel(value)
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
    <label className="form-label">
      <strong className='form-label-strong'>Emelet/Ajtó:</strong>
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