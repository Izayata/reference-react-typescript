import { FirstnameInput } from './FirstnameInput/FirstnameInput'
import { LastnameInput } from './LastnameInput/LastnameInput'
import { PhoneNumberInput } from './PhoneNumberInput/PhoneNumberInput'

export interface PersonalDetailsProp {
  formData: {
    firstname: string
    lastname: string
    phoneNumber: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PersonalDetailsInput({
  formData,
  onChange,
}: PersonalDetailsProp
) {
  return (
    <>
      <FirstnameInput
        value={formData.firstname}
        onChange={onChange}
      />
      <LastnameInput
        value={formData.lastname}
        onChange={onChange}
      />
      <PhoneNumberInput
        value={formData.phoneNumber}
        onChange={onChange}
      />        
    </>
  )
}
