import React, { useState } from 'react'
import { Modal } from '../../../functional/Modal/Modal'
import { fetchCsrfToken } from '../../../../supports/fetch-utilities/fetchCsrfToken'
import { LastnameInput } from '../../../input/customer/LastnameInput/LastnameInput'
import { FirstnameInput } from '../../../input/customer/FirstnameInput/FirstnameInput'
import { PhoneNumberInput } from '../../../input/customer/PhoneNumberInput/PhoneNumberInput'
import { PersonalDetailsModel } from '../../../../model/PersonalDetailsModel'
import { CustomerModel } from '../../../../model/CustomerModel'
import { convertPersonalDetailsFormDataToPersonalDetailsModel } from '../../../../converter/PersonalDetailsConverter'
import { sleep } from '../../../../utils/sleep/SleepUtils'
import { toast } from 'react-toastify'
import { handleErrorMessages } from '../../../../utils/ErrorUtils'
import { LoadingOverlay } from '../../../functional/LoadingOverlay/LoadingOverlay'
import { PersonalDetailsInput } from '../../../input/customer/PersonalDetailsInput'
import { useModal } from '../../../../context/ModalMessageContext/ModalMessageContext'

export function PersonalData({ customer, onPersonalDataUpdated }: { customer: CustomerModel, onPersonalDataUpdated?: () => void }) {
  const [editMode, setEditMode] = useState(false)
  const [personalDetailsForm, setPersonalDetailsForm] = useState(getInitialForm(customer))
  const { setModalMessage } = useModal()
  const [loadingOverlay, setLoadingOverlay] = useState(false)

  function getInitialForm(customer: CustomerModel) {
    return {
      firstname: customer.personalDetails.firstname.value || '',
      lastname: customer.personalDetails.lastname.value || '',
      phoneNumber: customer.personalDetails.phoneNumber.value || ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalDetailsForm({ ...personalDetailsForm, [e.target.name]: e.target.value })
  }

  const handleEdit = () => {
    setEditMode(true)
    setModalMessage(null)
  }

  const handleCancel = () => {
    setEditMode(false)
    setPersonalDetailsForm(getInitialForm(customer))
    setModalMessage(null)
  }

  async function updatePersonalData(newPersonalData: PersonalDetailsModel) {
    const res = await fetch('/v1/customer/personal-details', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': await fetchCsrfToken()
      },
      credentials: 'include',
      body: JSON.stringify(newPersonalData)
    })

    if (!res.ok) throw new Error('Hiba történt a mentés során!')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalMessage(null)
    setLoadingOverlay(true)

    try {
      const newPersonalDetails: PersonalDetailsModel = convertPersonalDetailsFormDataToPersonalDetailsModel(personalDetailsForm)

      if (newPersonalDetails.equals(customer.personalDetails)) {
        throw new Error('A módosított adatok megegyeznek a jelenlegi adatokkal!')
      }

      await updatePersonalData(newPersonalDetails)
      setPersonalDetailsForm(getInitialForm(customer))

      await sleep(1000)
      if (onPersonalDataUpdated) onPersonalDataUpdated()
      
      await sleep(500)
      toast.success('Személyes adatok sikeresen frissítve!')
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
        <h3 className="user-profile-data-container-title">Személyes adatok</h3>
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
        <div className="user-profile-data-container-data-item-container">
          <div className="user-profile-data-container-data-item">
            <strong >Keresztnév:</strong>
            {customer.personalDetails.firstname.value}
          </div>
          <div className="user-profile-data-container-data-item">
            <strong >Vezetéknév:</strong>
            {customer.personalDetails.lastname.value}
          </div>
          <div className="user-profile-data-container-data-item">
            <strong >Telefonszám:</strong>
            {customer.personalDetails.phoneNumber.value}
          </div>
        </div>
      )}
      {editMode && (
        <button
          className="register-page-button show-on-mobile"
          onClick={handleEdit}
          type="button"
        >
          Módosítás
        </button>
      )}
      {editMode && (
        <form onSubmit={handleSave} className="register-page-form" style={{ marginTop: '1rem' }}>
          <PersonalDetailsInput
            formData={personalDetailsForm}
            onChange={handleChange}
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="application-button-style" type="submit">Mentés</button>
            <button className="application-button-style" type="button" onClick={handleCancel}>Mégse</button>
          </div>
        </form>
      )}
    </section>
  )
}
