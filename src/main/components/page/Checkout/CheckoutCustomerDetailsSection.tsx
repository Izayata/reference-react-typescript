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
  return (
    <section className='form-container checkout-page customer-details'>
      {isAuthenticated && !editMode && (
        <>
          <div>
            <h3 className='checkout-section-title'>Személyes adatok</h3>
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
            <strong>Keresztnév:</strong>
            {myUserData?.customer?.personalDetails?.firstname?.value ? myUserData?.customer?.personalDetails?.firstname?.value : 'Name cannot be found'}
          </div>
          <div className='personal-information-element-container'>
            <strong>Vezetéknév:</strong>
            {myUserData?.customer?.personalDetails?.firstname?.value ? myUserData?.customer?.personalDetails?.lastname?.value : 'Name cannot be found'}
          </div>
          <div className='personal-information-element-container'>
            <strong>Telefonszám:</strong>
            <div className='personal-information-element-phone-number'>
              {myUserData?.customer?.personalDetails?.firstname?.value ? myUserData?.customer?.personalDetails?.phoneNumber?.value : 'Name cannot be found'}
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
            <h3 className='checkout-section-title'>Szállítási cím</h3>
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
            <strong>Irányítószám:</strong>
            {myUserData?.customer?.shippingAddress?.zipCode?.value ? myUserData?.customer?.shippingAddress?.zipCode?.value : 'Zip code cannot be found'}
          </div>
          <div className='personal-information-element-container'>
            <strong>Város:</strong>
            {myUserData?.customer?.shippingAddress?.city?.value ? myUserData?.customer?.shippingAddress?.city?.value : 'City cannot be found'}
          </div>
          <div className='personal-information-element-container'>
            <strong>Közterület:</strong>
            {myUserData?.customer?.shippingAddress?.street?.value ? myUserData?.customer?.shippingAddress?.street?.value : 'Street cannot be found'}
          </div>
          <div className='personal-information-element-container'>
            <strong>Házszám:</strong>
            {myUserData?.customer?.shippingAddress?.streetNumber?.value ? myUserData?.customer?.shippingAddress?.streetNumber?.value : 'Street number cannot be found'}
          </div>
          {myUserData?.customer?.shippingAddress?.floorDoor?.value && (
            <div className='personal-information-element-container'>
              <strong>Emelet/Ajtó:</strong>
              {myUserData?.customer?.shippingAddress?.floorDoor?.value}
            </div>
          )}
          <button
            className="application-button-style animated"
            onClick={onEdit}
            type="button"
          >
            Módosítás
          </button>
        </>
      )}
      {isAuthenticated && editMode && (
        <form onSubmit={onSave} className="form-container" style={{ animation: 'none' }}>
          <AddressInput formData={convertShippingAddressFormDataToFormData(shippingAddressForm)} onChange={onShippingAddressChange} />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <button className="application-button-style" type="submit">Mentés</button>
            <button className="application-button-style" type="button" onClick={onCancel}>Mégse</button>
          </div>
        </form>
      )}
      {!isAuthenticated && (
        <form className='form-container' style={{ animation: 'none' }}>
          <div>
            <h3 className='checkout-section-title'>Személyes adatok</h3>
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
            <h3 className='checkout-section-title'>Számlázási cím</h3>
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
          <div
            style={{ textWrap: 'pretty' }}
            onClick={onToggleBillingAddressSameAsShipping}
          >
            <input
              type='checkbox'
              checked={billingAddressSameAsShipping}
            />
            A számlázási cím megegyezik a szállítási címmel
          </div>
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
                <h3 className='checkout-section-title'>Szállítási cím</h3>
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

        </form>
      )}
    </section>
  )
}
