import { BillingAddress } from './BillingAddress/BillingAddress'
import { ShippingAddress } from './ShippingAddress/ShippingAddress'
import { PersonalData } from './PersonalData/PersonalData'
import { LoginData } from './LoginData/LoginData'
import { useEffect, useRef, useState } from 'react'
import { fetchAuthenticatedUserDetails } from '../../../utils/pages/account/accountPageUtils'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { MyUserModelBuilder } from '../../../builder/MyUserModelBuilder'
import { MyUserModel } from '../../../model/MyUserModel'
import { handleErrorMessages } from '../../../utils/ErrorUtils'

import './css/user-profile-content-container.css'
import './css/shared/user-profile-data-card-container.css'
import './css/shared/user-profile-data-card-container-group.css'
import './css/shared/user-profile-data-container.css'
import './css/shared/user-profile-data-container-data-item.css'
import './css/shared/user-profile-data-container-data-item-container.css'
import './css/shared/user-profile-data-container-title.css'
import './css/shared/user-profile-edit-mode-button-container.css'
import './css/user-profile-title.css'
import { sleep } from '../../../utils/sleep/SleepUtils'

export function UserProfile() {
  const [user, setUser] = useState<MyUserModel | null>(null)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const { setModalMessage } = useModal()
  const myUserModelBuilder = useRef(new MyUserModelBuilder())


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await sleep(1000)
      fetchAuthenticatedUserDetails()
        .then(setUser)
        .catch(setModalMessage)
        .finally(() => setLoading(false))
    }
    
    fetchData()
  }, [refresh])

  if (loading) return <LoadingOverlay />

  if (!user) {
    setModalMessage('Felhasználói adatok lekérése sikertelen!')
    return <></>
  }

  let myUser = null

  try {
    myUser = myUserModelBuilder
      .current
      .setEmail(user.email)
      .setMyUsername(user.myUsername)
      .setCustomer(user.customer)
      .build()
  } catch (e: unknown) {
    setModalMessage(handleErrorMessages(e))
  }

  if (!myUser) {
    setModalMessage('Felhasználói adatok lekérése sikertelen!')
    return <></>
  }
  
  const customer = myUser.customer
  const defaultShippingAddress = customer.shippingAddress
  const billingAddress = customer.billingAddress

  return (
    <div className = 'user-profile-content-container'>
      <h2 className='page-title'>Profil</h2>
      <div className = 'user-profile-data-card-container'>
        <div className='user-profile-data-card-container-group'>
          <LoginData user = {user} />
          <PersonalData customer = {customer} onPersonalDataUpdated={() => setRefresh(r => !r)}/>
        </div>
        <div className='user-profile-data-card-container-group'>
          <BillingAddress address = {billingAddress} onAddressUpdated={() => setRefresh(r => !r)}/>
          <ShippingAddress address = {defaultShippingAddress} onAddressUpdated={() => setRefresh(r => !r)}/>
        </div>
      </div>
    </div>
  )
}