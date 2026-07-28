import { useTranslation } from 'react-i18next'
import { AddressInput } from '../../input/customer/address/AddressInput'
import { convertBillingAddressFormDataToFormData, convertShippingAddressFormDataToFormData } from '../../../converter/formDataConverter'
import { PersonalDetailsInput } from '../../input/customer/PersonalDetailsInput'
import { EmailInput } from '../../input/myUser/EmailInput/EmailInput'
import { MyUserModel } from '../../../model/MyUserModel'

interface CheckoutCustomerDetailsSectionProps {
  isAuthenticated: boolean
  editMode: boolean
  myUserData: MyUserModel | null
  shippingAddressForm: { shippingZipCode: string, shippingCity: string, shippingStreet: string, shippingStreetNumber: string, shippingFloorDoor: string }
  billingAddressForm: { billingZipCode: string, billingCity: string, billingStreet: string, billingStreetNumber: string, billingFloorDoor: string }
  personalDetailsForm: { firstname: string, lastname: string, phoneNumber: string, email: string }
  emailForm: { email: string }
  billingAddressSameAsShipping: boolean
  onEdit: () => void
  onSave: (e: React.FormEvent) => void
  onCancel: () => void
  onShippingAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBillingAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPersonalDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onToggleBillingAddressSameAsShipping: () => void
}

export function CheckoutCustomerDetailsSection({
  isAuthenticated,
  editMode,
  myUserData,
  shippingAddressForm,
  billingAddressForm,
  personalDetailsForm,
  emailForm,
  billingAddressSameAsShipping,
  onEdit,
  onSave,
  onCancel,
  onShippingAddressChange,
  onBillingAddressChange,
  onPersonalDetailsChange,
  onEmailChange,
  onToggleBillingAddressSameAsShipping
}: CheckoutCustomerDetailsSectionProps) {
  const { t } = useTranslation()
  return (
    <section className='form-container checkout-page customer-details'>
      {isAuthenticated && !editMode && (
        <>
          <div>
            <h3 className='checkout-section-title'>{t('checkout.personalDetailsTitle')}</h3>
            <div
              style={{
                width: '100%',
                border: '1px solid',
                borderRadius: '5px',
                borderColor: '#000',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </div>
          <div className='personal-information-element-container'>
            <strong>{t('checkout.firstnameLabel')}</strong>
            {myUserData?.customer?.personalDetails?.firstname?.value ? myUserData?.customer?.personalDetails?.firstname?.value : t('checkout.nameNotFound')}
          </div>
          <div className='personal-information-element-container'>
            <strong>{t('checkout.lastnameLabel')}</strong>
            {myUserData?.customer?.personalDetails?.firstname?.value ? myUserData?.customer?.personalDetails?.lastname?.value : t('checkout.nameNotFound')}
          </div>
          <div className='personal-information-element-container'>
            <strong>{t('checkout.phoneNumberLabel')}</strong>
            <div className='personal-information-element-phone-number'>
              {myUserData?.customer?.personalDetails?.firstname?.value ? myUserData?.customer?.personalDetails?.phoneNumber?.value : t('checkout.nameNotFound')}
            </div>
          </div>
          <div
            style={{
              width: '100%',
              border: '1px solid',
              borderRadius: '5px',
              borderColor: '#695A3D',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <div>
            <h3 className='checkout-section-title'>{t('checkout.shippingAddressTitle')}</h3>
            <div
              style={{
                width: '100%',
                border: '1px solid',
                borderRadius: '5px',
                borderColor: '#000',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </div>
          <div className='personal-information-element-container'>
            <strong>{t('checkout.zipCodeLabel')}</strong>
            {myUserData?.customer?.shippingAddress?.zipCode?.value ? myUserData?.customer?.shippingAddress?.zipCode?.value : t('checkout.zipCodeNotFound')}
          </div>
          <div className='personal-information-element-container'>
            <strong>{t('checkout.cityLabel')}</strong>
            {myUserData?.customer?.shippingAddress?.city?.value ? myUserData?.customer?.shippingAddress?.city?.value : t('checkout.cityNotFound')}
          </div>
          <div className='personal-information-element-container'>
            <strong>{t('checkout.streetLabel')}</strong>
            {myUserData?.customer?.shippingAddress?.street?.value ? myUserData?.customer?.shippingAddress?.street?.value : t('checkout.streetNotFound')}
          </div>
          <div className='personal-information-element-container'>
            <strong>{t('checkout.streetNumberLabel')}</strong>
            {myUserData?.customer?.shippingAddress?.streetNumber?.value ? myUserData?.customer?.shippingAddress?.streetNumber?.value : t('checkout.streetNumberNotFound')}
          </div>
          {myUserData?.customer?.shippingAddress?.floorDoor?.value && (
            <div className='personal-information-element-container'>
              <strong>{t('checkout.floorDoorLabel')}</strong>
              {myUserData?.customer?.shippingAddress?.floorDoor?.value}
            </div>
          )}
          <button
            className="application-button-style animated"
            onClick={onEdit}
            type="button"
          >
            {t('checkout.editButton')}
          </button>
        </>
      )}
      {isAuthenticated && editMode && (
        <form onSubmit={onSave} className="form-container" style={{ animation: 'none' }}>
          <AddressInput formData={convertShippingAddressFormDataToFormData(shippingAddressForm)} onChange={onShippingAddressChange} />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <button className="application-button-style" type="submit">{t('checkout.saveButton')}</button>
            <button className="application-button-style" type="button" onClick={onCancel}>{t('checkout.cancelButton')}</button>
          </div>
        </form>
      )}
      {!isAuthenticated && (
        <div className='form-container' style={{ animation: 'none' }}>
          <div>
            <h3 className='checkout-section-title'>{t('checkout.personalDetailsTitle')}</h3>
            <div
              style={{
                width: '100%',
                border: '1px solid',
                borderRadius: '5px',
                borderColor: '#000',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </div>
          <PersonalDetailsInput formData={personalDetailsForm} onChange={onPersonalDetailsChange} />
          <EmailInput value={emailForm.email} onChange={onEmailChange} />
          <div
            style={{
              width: '100%',
              border: '1px solid',
              borderRadius: '5px',
              borderColor: '#695A3D',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <div>
            <h3 className='checkout-section-title'>{t('checkout.billingAddressTitle')}</h3>
            <div
              style={{
                width: '100%',
                border: '1px solid',
                borderRadius: '5px',
                borderColor: '#000',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </div>
          <AddressInput formData={convertBillingAddressFormDataToFormData(billingAddressForm)} onChange={onBillingAddressChange} />
          <label style={{ textWrap: 'pretty' }}>
            <input
              type='checkbox'
              checked={billingAddressSameAsShipping}
              onChange={onToggleBillingAddressSameAsShipping}
            />
            {t('checkout.billingSameAsShipping')}
          </label>
          {!billingAddressSameAsShipping && (
            <>
              <div
                style={{
                  width: '100%',
                  border: '1px solid',
                  borderRadius: '5px',
                  borderColor: '#695A3D',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              />
              <div>
                <h3 className='checkout-section-title'>{t('checkout.shippingAddressTitle')}</h3>
                <div
                  style={{
                    width: '100%',
                    border: '1px solid',
                    borderRadius: '5px',
                    borderColor: '#000',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              </div>
              <AddressInput formData={convertShippingAddressFormDataToFormData(shippingAddressForm)} onChange={onShippingAddressChange} />
            </>
          )}

        </div>
      )}
    </section>
  )
}
