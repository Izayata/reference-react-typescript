import React, { useState } from 'react'
import { PasswordInput } from '../../../input/myUser/PasswordInput/PasswordInput'
import { fetchCsrfToken } from '../../../../supports/fetch-utilities/fetchCsrfToken'
import { sleep } from '../../../../utils/sleep/SleepUtils'
import { toast } from 'react-toastify'
import { handleErrorMessages } from '../../../../utils/ErrorUtils'
import { LoadingOverlay } from '../../../functional/LoadingOverlay/LoadingOverlay'
import { PasswordChangeModelBuilder } from '../../../../builder/PasswordChangeModelBuilder'
import { MyUserModel } from '../../../../model/MyUserModel'
import { PasswordChangeModel } from '../../../../model/PasswordChangeModel'
import { NewPasswordDetailsModelBuilder } from '../../../../builder/NewPasswordDetailsModelBuilder'
import { useModal } from '../../../../context/ModalMessageContext/ModalMessageContext'

export function LoginData({ user }: { user: MyUserModel }) {
  const [editMode, setEditMode] = useState(false)
  const [passwordForm, setPasswordForm] = useState(getInitialForm())
  const { setModalMessage } = useModal()
  const [loadingOverlay, setLoadingOverlay] = useState(false)

  function getInitialForm() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  }

  if (!user) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = () => {
    setEditMode(true)
    setModalMessage(null)
  }

  const handleCancel = () => {
    setEditMode(false)
    setPasswordForm(getInitialForm())
    setModalMessage(null)
  }

  async function updatePassword(data: PasswordChangeModel) {
    const res = await fetch('/v1/account/password', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': await fetchCsrfToken()
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(
        errorData.error || 'Váratlan hiba történt a jelszó módosítása során!')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalMessage(null)
    setLoadingOverlay(true)

    try {
      const passwordChangeBuilder = new PasswordChangeModelBuilder()
      const passwordChangeData = passwordChangeBuilder
        .setCurrentPassword(passwordForm.currentPassword)
        .setNewPasswordWrapper(
          new NewPasswordDetailsModelBuilder()
            .setNewPassword(passwordForm.newPassword)
            .setConfirmNewPassword(passwordForm.confirmNewPassword)
            .build()
        )
        .build()

      await updatePassword(passwordChangeData)

      await sleep(1000)
      setEditMode(false)
      setPasswordForm(getInitialForm())
      setLoadingOverlay(false)
      await sleep(500)
      toast.success('Jelszó sikeresen módosítva!')
    } catch (e: unknown) {
      setLoadingOverlay(false)
      const errorMessage = handleErrorMessages(e)
      setModalMessage(errorMessage)
      return
    }
  }

  return (
    <section className="card-container user-profile">
      {loadingOverlay && <LoadingOverlay/>}
      <div>
        <h3 className="user-profile-data-container-title">Fiók adatok</h3>
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
              <strong>Felhasználónév:</strong>
              {user.myUsername.value}
            </div>
            <div className="user-profile-data-container-data-item">
              <strong>E-mail:</strong>
              {user.email.value}
            </div>
          </div>
        </>
      )}
      {!editMode && (
        <button
          className="application-button-style animated"
          onClick={handlePasswordChange}
          type="button"
        >
          Jelszó Módosítása
        </button>
      )}
      {editMode && (
        <form onSubmit={handleSave} className="form-orientation">
          <PasswordInput
            value={passwordForm.currentPassword}
            onChange={handleChange}
            name="currentPassword"
            label="Jelenlegi jelszó:"
          />
          
          <PasswordInput
            value={passwordForm.newPassword}
            onChange={handleChange}
            name="newPassword"
            label="Új jelszó:"
          />
          
          <PasswordInput
            value={passwordForm.confirmNewPassword}
            onChange={handleChange}
            name="confirmNewPassword"
            label="Új jelszó megerősítése:"
          />
          
          <div className='user-profile-edit-mode-button-container'>
            <button className="application-button-style" type="submit" >Mentés</button>
            <button className="application-button-style" type="button" onClick={handleCancel}>Mégse</button>
          </div>
        </form>
      )}
    </section>
  )
}