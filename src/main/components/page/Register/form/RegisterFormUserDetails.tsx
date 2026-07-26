import React from 'react'
import { UsernameInput } from '../../../input/myUser/UsernameInput/UsernameInput'
import { PasswordInput } from '../../../input/myUser/PasswordInput/PasswordInput'
import { ConfirmPasswordInput } from '../../../input/myUser/ConfirmPasswordInput/ConfirmPasswordInput'
import { EmailInput } from '../../../input/myUser/EmailInput/EmailInput'

interface RegisterFormUserDetailsProps {
  registrationData: {
    username: string
    password: string
    confirmPassword: string
    email: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export const RegisterFormUserDetails: React.FC<RegisterFormUserDetailsProps> = ({
  registrationData,
  onChange,
  onSubmit
}) => (
  <form onSubmit={onSubmit} className="form-orientation">
    <UsernameInput
      value={registrationData.username}
      onChange={onChange}
    />
    <PasswordInput
      value={registrationData.password}
      onChange={onChange}
      name="password"
      label='Jelszó:'
    />
    <ConfirmPasswordInput
      value={registrationData.confirmPassword}
      originalPassword={registrationData.password}
      onChange={onChange}
    />
    <EmailInput
      value={registrationData.email}
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
