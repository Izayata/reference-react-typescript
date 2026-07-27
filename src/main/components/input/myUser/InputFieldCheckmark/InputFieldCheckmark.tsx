import React from 'react'
import { useTranslation } from 'react-i18next'

export const InputFieldCheckmark: React.FC = () => {
  const { t } = useTranslation()
  return (
    <span className="input-form-mark" aria-label={t('inputs.usernameAvailableAriaLabel')}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="10" fill="#45BA00"/>
        <path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}
