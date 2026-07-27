import React, { useState } from 'react'
import { fetchCsrfToken } from '../../../../supports/fetch-utilities/fetchCsrfToken'
import { AddressModel } from '../../../../model/customer/AddressModel'
import { convertBillingAddressFormToAddressModel } from '../../../../converter/AddressModelConverter'
import { toast } from 'react-toastify'
import { sleep } from '../../../../utils/sleep/SleepUtils'
import { LoadingOverlay } from '../../../functional/LoadingOverlay/LoadingOverlay'
import { convertBillingAddressFormDataToFormData } from '../../../../converter/formDataConverter'
import { AddressInput } from '../../../input/customer/address/AddressInput'
import { handleErrorMessages } from '../../../../utils/ErrorUtils'
import { useModal } from '../../../../context/ModalMessageContext/ModalMessageContext'

export function BillingAddress({ address, onAddressUpdated }: { address: AddressModel, onAddressUpdated?: () => void }) {  
  const [editMode, setEditMode] = useState(false)
  const [billingAddressForm, setBillingAddressForm] = useState(getInitialForm(address))
  const { setModalMessage } = useModal()
  const [loadingOverlay, setLoadingOverlay] = useState(false)

  const billingFieldMap: Record<string, string> = {
    zip: 'billingZipCode',
    city: 'billingCity',
    street: 'billingStreet',
    streetNumber: 'billingStreetNumber',
    floorDoor: 'billingFloorDoor'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const mappedName = billingFieldMap[name] || name
    setBillingAddressForm({ ...billingAddressForm, [mappedName]: value })
  }

  function getInitialForm(address: AddressModel) {
    return {
      billingZipCode: address.zipCode.value || '',
      billingCity: address.city.value || '',
      billingStreet: address.street.value || '',
      billingStreetNumber: address.streetNumber.value || '',
      billingFloorDoor: address.floorDoor?.value || ''
    }
  }

  const handleEdit = () => {
    setEditMode(true)
    setModalMessage(null)
  }

  const handleCancel = () => {
    setEditMode(false)
    setBillingAddressForm(getInitialForm(address))
    setModalMessage(null)
  }

  async function updateBillingAddress(newAddress: AddressModel) {
    const res = await fetch('/v1/customer/billing-address', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': await fetchCsrfToken()
      },
      credentials: 'include',
      body: JSON.stringify(newAddress)
    })

    if (!res.ok) throw new Error('Hiba történt a mentés során!')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalMessage(null)
    setLoadingOverlay(true)

    try {
      const newAddress = convertBillingAddressFormToAddressModel(billingAddressForm)

      if (newAddress.equals(address)) {
        throw new Error('A módosított adatok megegyeznek a jelenlegi címmel!')
      }

      await updateBillingAddress(newAddress)
      setBillingAddressForm(getInitialForm(newAddress))

      await sleep(1000)
      if (onAddressUpdated) onAddressUpdated()
      await sleep(500)
      toast.success('Számlázási cím sikeresen frissítve!')
    } catch (e: unknown) {
      setLoadingOverlay(false)
      setModalMessage(handleErrorMessages(e))
      return
    }
  }

  return (
    <section className="card-container user-profile">
      {loadingOverlay && <LoadingOverlay/>}
      <div >
        <h3 className="user-profile-data-container-title">Számlázási cím</h3>
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
              <strong>Irányítószám:</strong>
              {address.zipCode.value}
            </div>
            <div className="user-profile-data-container-data-item">
              <strong>Város:</strong>
              {address.city.value}
            </div>
            <div className="user-profile-data-container-data-item">
              <strong>Utca:</strong>
              {address.street.value}
            </div>
            <div className="user-profile-data-container-data-item">
              <strong>Házszám:</strong>
              {address.streetNumber.value}
            </div>
            {address.floorDoor?.value && (
              <div className="user-profile-data-container-data-item">
                <strong>Emelet/Ajtó:</strong>
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
          Módosítás
        </button>
      )}
      {editMode && (
        <form onSubmit={handleSave} className="form-orientation">
          <AddressInput formData={convertBillingAddressFormDataToFormData(billingAddressForm)} onChange={handleChange} />
          <div className='user-profile-edit-mode-button-container'>
            <button className="application-button-style" type="submit">Mentés</button>
            <button className="application-button-style" type="button" onClick={handleCancel}>Mégse</button>
          </div>
        </form>
      )}
    </section>
  )
}

