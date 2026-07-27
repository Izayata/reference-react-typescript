import { convertRegistrationFormDataToBillingAddressFormData, convertRegistrationFormDataToShippingAddressFormData } from '../../../../converter/formDataConverter'
import { RegisterFormBillingAddress } from './RegisterFormBillingAddress'
import { RegisterFormShippingAddress } from './RegisterFormShippingAddress'

interface RegisterFormAddressesProps {
  handleSetAddressesStep: (e: React.FormEvent) => void
  registrationFormData: Parameters<typeof convertRegistrationFormDataToBillingAddressFormData>[0]
    & Parameters<typeof convertRegistrationFormDataToShippingAddressFormData>[0]
  handleRegistrationDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isShippingAddressFormDisplayed: boolean
  toggleShippingAddressForm: () => void
}

export function RegisterFormAddresses({
  handleSetAddressesStep,
  registrationFormData,
  handleRegistrationDataChange,
  isShippingAddressFormDisplayed,
  toggleShippingAddressForm
}: RegisterFormAddressesProps) {
  return(
    <form onSubmit={handleSetAddressesStep} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
      <h2 style={{ margin: '0px' }}>Számlázási cím</h2>
      <RegisterFormBillingAddress
        billingAddressData={convertRegistrationFormDataToBillingAddressFormData(registrationFormData)}
        onChange={handleRegistrationDataChange}
      />
      <span>
        <input type="checkbox" onChange={toggleShippingAddressForm}/> A szállítási cím megegyezik a számlázási címmel
      </span>
      {isShippingAddressFormDisplayed && (
        <>
          <div className='navigation-bar-separator' />
          <h2 style={{ margin: '0px' }}>Szállítási cím</h2>
          <RegisterFormShippingAddress
            shippingAddressData={convertRegistrationFormDataToShippingAddressFormData(registrationFormData)}
            onChange={handleRegistrationDataChange}
          />
        </>
      )}
      <button
        className='application-button-style'
        type="submit"
        style={{ marginTop: '1rem' }}
      >
        Regisztráció
      </button>
    </form>
  )
}