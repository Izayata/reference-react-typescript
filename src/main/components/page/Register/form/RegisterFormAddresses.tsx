import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  return(
    <form onSubmit={handleSetAddressesStep} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
      <h2 style={{ margin: '0px' }}>{t('register.billingAddressTitle')}</h2>
      <RegisterFormBillingAddress
        billingAddressData={convertRegistrationFormDataToBillingAddressFormData(registrationFormData)}
        onChange={handleRegistrationDataChange}
      />
      <label>
        <input type="checkbox" checked={!isShippingAddressFormDisplayed} onChange={toggleShippingAddressForm}/> {t('register.shippingSameAsBilling')}
      </label>
      {isShippingAddressFormDisplayed && (
        <>
          <div className='navigation-bar-separator' />
          <h2 style={{ margin: '0px' }}>{t('register.shippingAddressTitle')}</h2>
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
        {t('register.registerButton')}
      </button>
    </form>
  )
}