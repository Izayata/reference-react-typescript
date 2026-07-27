import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchCsrfToken } from '../../../../supports/fetch-utilities/fetchCsrfToken'
import { AddressModel } from '../../../../model/customer/AddressModel'
import { convertShippingAddressFormToAddressModel } from '../../../../converter/AddressModelConverter'
import { sleep } from '../../../../utils/sleep/SleepUtils'
import { toast } from 'react-toastify'
import { AddressInput } from '../../../input/customer/address/AddressInput'
import { convertShippingAddressFormDataToFormData } from '../../../../converter/formDataConverter'
import { LoadingOverlay } from '../../../functional/LoadingOverlay/LoadingOverlay'
import { handleErrorMessages } from '../../../../utils/ErrorUtils'
import { useModal } from '../../../../context/ModalMessageContext/ModalMessageContext'

export function ShippingAddress({ address, onAddressUpdated }: { address: AddressModel, onAddressUpdated?: () => void }) {
  const { t } = useTranslation()
  const [editMode, setEditMode] = useState(false)
  const [shippingAddressForm, setShippingAddressForm] = useState(getInitialForm(address))
  const { setModalMessage } = useModal()
  const [loadingOverlay, setLoadingOverlay] = useState(false)

  const shippingFieldMap: Record<string, string> = {
    zip: 'shippingZipCode',
    city: 'shippingCity',
    street: 'shippingStreet',
    streetNumber: 'shippingStreetNumber',
    floorDoor: 'shippingFloorDoor'
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const mappedName = shippingFieldMap[name] || name
    setShippingAddressForm({ ...shippingAddressForm, [mappedName]: value })
  }

  function getInitialForm(address: AddressModel) {
    return {
      shippingZipCode: address.zipCode.value || '',
      shippingCity: address.city.value || '',
      shippingStreet: address.street.value || '',
      shippingStreetNumber: address.streetNumber.value || '',
      shippingFloorDoor: address.floorDoor?.value || ''
    }
  }

  const handleEdit = () => {
    setEditMode(true)
    setModalMessage(null)
  }

  const handleCancel = () => {
    setEditMode(false)
    setShippingAddressForm(getInitialForm(address))
    setModalMessage(null)
  }

  async function updateShippingAddress(newAddress: AddressModel) {
    const res = await fetch('/v1/customer/shipping-address', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': await fetchCsrfToken()
      },
      credentials: 'include',
      body: JSON.stringify(newAddress)
    })

    if (!res.ok) throw new Error(t('userProfile.saveError'))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalMessage(null)
    setLoadingOverlay(true)

    try {
      const newAddress = convertShippingAddressFormToAddressModel(shippingAddressForm)

      if (newAddress.equals(address)) {
        throw new Error(t('userProfile.shippingAddressUnchangedError'))
      }

      await updateShippingAddress(newAddress)
      setShippingAddressForm(getInitialForm(newAddress))

      await sleep(1000)
      if (onAddressUpdated) onAddressUpdated()
      await sleep(500)
      toast.success(t('userProfile.shippingAddressUpdateSuccess'))
    } catch (e: unknown) {
      setLoadingOverlay(false)
      setModalMessage(handleErrorMessages(e))
      return
    }
  }

  return (
    <section className = "card-container user-profile">
      {loadingOverlay && <LoadingOverlay/>}
      <div>
        <h3 className="user-profile-data-container-title">{t('userProfile.shippingAddressTitle')}</h3>
        <div
          style={{
            width: 'calc(100% - (1rem * 2))',
            border: '1px solid',
            borderRadius: '5px',
            borderColor: '#695A3D',
            position: 'absolute',
            left: '0',
            right: '0',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </div>
      {!editMode && (
        <>
          <div className="user-profile-data-container-data-item-container">
            <div className="user-profile-data-container-data-item">
              <strong>{t('userProfile.zipCodeLabel')}</strong>
              {address.zipCode.value}
            </div>
            <div className="user-profile-data-container-data-item">
              <strong>{t('userProfile.cityLabel')}</strong>
              {address.city.value}
            </div>
            <div className="user-profile-data-container-data-item">
              <strong>{t('userProfile.streetLabel')}</strong>
              {address.street.value}
            </div>
            <div className="user-profile-data-container-data-item">
              <strong>{t('userProfile.streetNumberLabel')}</strong>
              {address.streetNumber.value}
            </div>
            {address.floorDoor?.value && (
              <div className="user-profile-data-container-data-item">
                <strong>{t('userProfile.floorDoorLabel')}</strong>
                {address.floorDoor.value}
              </div>
            )}
          </div>
        </>
      )}
      {!editMode && (
        <button
          className="application-button-style animated"
          onClick={handleEdit}
          type="button"
        >
          {t('userProfile.editButton')}
        </button>
      )}
      {editMode && (
        <form onSubmit={handleSave} className="form-orientation">
          <AddressInput formData={convertShippingAddressFormDataToFormData(shippingAddressForm)} onChange={handleChange} />
          <div className='user-profile-edit-mode-button-container'>
            <button className="application-button-style" type="submit">{t('userProfile.saveButton')}</button>
            <button className="application-button-style" type="button" onClick={handleCancel}>{t('userProfile.cancelButton')}</button>
          </div>
        </form>
      )}
    </section>
  )
}
