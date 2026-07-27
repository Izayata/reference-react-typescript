import React from 'react'
import { useTranslation } from 'react-i18next'

export const InputFieldXmark: React.FC = () => {
  const { t } = useTranslation()
  return (
    <span className="input-form-mark" aria-label={t('inputs.usernameUnavailableAriaLabel')}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill='#CD0017'/>
        <line x1="7" y1="7" x2="13" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="13" y1="7" x2="7" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  )
}
