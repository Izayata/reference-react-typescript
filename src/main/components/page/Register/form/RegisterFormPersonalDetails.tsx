import React from 'react'
import { PersonalDetailsInput } from '../../../input/customer/PersonalDetailsInput'

interface RegisterFormPersonalDetailsProps {
  registrationData: {
    firstname: string
    lastname: string
    phoneNumber: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export const RegisterFormPersonalDetails: React.FC<RegisterFormPersonalDetailsProps> = ({
  registrationData,
  onChange,
  onSubmit
}) => (
  <form className="form-orientation" onSubmit={onSubmit}>
    <PersonalDetailsInput
      formData={registrationData}
      onChange={onChange}
    />
    <button
      type="submit"
      className="application-button-style"
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
    >
      Tovább
    </button>
  </form>
)
