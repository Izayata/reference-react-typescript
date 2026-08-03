import React from 'react'
import { useTranslation } from 'react-i18next'
import { STREET_TYPES } from '../../../../../utils/customer/address/StreetTypeUtils'

import '../../../../../css/shared/form/form-label-strong.css'

interface StreetTypeInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const StreetTypeInput: React.FC<StreetTypeInputProps> = ({ name, value, onChange }) => {
  const { t } = useTranslation()

  return (
    <label className="form-label">
      <div>
        <strong className='form-label-strong'>{t('inputs.streetTypeLabel')}</strong>
        <span className='form-required-indicator'>*</span>
      </div>
      <select
        className="form-input"
        name={name}
        onChange={onChange}
        required
        value={value}
      >
        <option value="" disabled>{t('inputs.streetTypePlaceholder')}</option>
        {STREET_TYPES.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </label>
  )
}
