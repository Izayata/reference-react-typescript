import { useRef, useState } from 'react'
import './css/error-message.css'
import './css/input-form-mark.css'
import './css/registration-form-input-wrapper.css'
import '../../../css/shared/form/form-container.css'
import '../../../css/shared/form/form-orientation.css'
import '../../../css/shared/form/form-required-indicator.css'
import { RegisterFormUserDetails } from './form/RegisterFormUserDetails'
import { convertRegistrationDataToMyUserRegistrationModel } from '../../../converter/MyUserRegistrationModelConverter'
import { checkUsernameExists, ERR_MSG_USERNAME_VALUE_EXISTS } from '../../../utils/myUser/UsernameUtils'
import { checkEmailExists, ERR_MSG_EMAIL_VALUE_EXISTS } from '../../../utils/EmailUtils'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { RegistrationModelBuilder } from '../../../builder/RegistrationModelBuilder'
import { handleErrorMessages } from '../../../utils/ErrorUtils'
import { RegisterFormPersonalDetails } from './form/RegisterFormPersonalDetails'
import { convertRegistrationDataToPersonalDetailsModel } from '../../../converter/PersonalDetailsConverter'
import { convertRegistrationFormDataToBillingAddressModel, convertRegistrationFormDataToShippingAddressModel } from '../../../converter/AddressModelConverter'
import { RegisterFormBillingAddress } from './form/RegisterFormBillingAddress'
import { convertRegistrationFormDataToBillingAddressFormData, convertRegistrationFormDataToShippingAddressFormData } from '../../../converter/formDataConverter'
import { RegisterFormShippingAddress } from './form/RegisterFormShippingAddress'
import { RegistrationModel } from '../../../model/RegistrationModel'
import { sleep } from '../../../utils/sleep/SleepUtils'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { RegisterFormAddresses } from './form/RegisterFormAddresses'

export function Register() {
  const [step, setStep] = useState<'setUserDetails' | 'setPersonalDetails' | 'setAddresses' | 'successfulRegistration'>('setUserDetails')
  const { setModalMessage } = useModal()
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [isShippingAddressFormDisplayed, setIsShippingAddressFormDisplayed] = useState(true)
  const [registrationFormData, setRegistrationFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstname: '',
    lastname: '',
    phoneNumber: '',
    shippingZipCode: '',
    shippingCity: '',
    shippingStreet: '',
    shippingStreetNumber: '',
    shippingFloorDoor: '',
    billingZipCode: '',
    billingCity: '',
    billingStreet: '',
    billingStreetNumber: '',
    billingFloorDoor: ''
  })
  const registrationModelBuilder = useRef(new RegistrationModelBuilder())

  const handleRegistrationDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegistrationFormData({ ...registrationFormData, [name]: value })
  }

  const toggleShippingAddressForm = () => {
    setIsShippingAddressFormDisplayed(!isShippingAddressFormDisplayed)
  }

  async function register() {
    const registrationModel: RegistrationModel = registrationModelBuilder.current.build()

    const registrationResponse = await fetch('/v1/req/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationModel),
      credentials: 'include',
    })

    if (!(registrationResponse.ok)) {
      const errorData = await registrationResponse.json()
      throw new Error(`Hiba történt: ${errorData.message || 'Ismeretlen hiba a felhasználó regisztrálásakor!'}`)
    }
  }

  const handleUserDetailsStep = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingOverlay(true)

    try {
      const myUserRegistration = convertRegistrationDataToMyUserRegistrationModel(registrationFormData)

      if (await checkUsernameExists(myUserRegistration.myUsername.value)) {
        throw new Error(ERR_MSG_USERNAME_VALUE_EXISTS)
      }

      if (await checkEmailExists(myUserRegistration.email.value)) {
        throw new Error(ERR_MSG_EMAIL_VALUE_EXISTS)
      }

      registrationModelBuilder.current.setMyUser(myUserRegistration)

      setStep('setPersonalDetails')
    } catch (e: any) {
      setModalMessage(handleErrorMessages(e))
    } finally {
      setLoadingOverlay(false)
    }
  }

  const handlePersonalDetailsStep = (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingOverlay(true)

    try {
      const personalDetails = convertRegistrationDataToPersonalDetailsModel(registrationFormData)
      registrationModelBuilder.current.setPersonalDetails(personalDetails)

      setStep('setAddresses')
    } catch (e: any) {
      handleErrorMessages(e)
    } finally {
      setLoadingOverlay(false)
    }
  }

  const handleSetAddressesStep = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingOverlay(true)

    try {
      console.log(registrationFormData.billingZipCode)
      const billingAddress = convertRegistrationFormDataToBillingAddressModel(registrationFormData)
      registrationModelBuilder.current.setBillingAddress(billingAddress)

      if (isShippingAddressFormDisplayed) {
        const shippingAddress = convertRegistrationFormDataToShippingAddressModel(registrationFormData)
        registrationModelBuilder.current.setShippingAddress(shippingAddress)
      } else {
        registrationModelBuilder.current.setShippingAddress(billingAddress)
      }

      await register()
      await sleep(1000)
      setStep('successfulRegistration')
    } catch (e: any) {
      handleErrorMessages(e)
    } finally {
      setLoadingOverlay(false)
    }
  }

  return (
    <>
      {loadingOverlay && (<LoadingOverlay />)}
      <div className="form-container" onSubmit={handleSetAddressesStep}>
        {step === 'setUserDetails' && (
          <RegisterFormUserDetails
            registrationData={registrationFormData}
            onChange={handleRegistrationDataChange}
            onSubmit={handleUserDetailsStep}
          />
        )}
        {step === 'setPersonalDetails' && (
          <RegisterFormPersonalDetails
            registrationData={registrationFormData}
            onChange={handleRegistrationDataChange}
            onSubmit={handlePersonalDetailsStep}
          />
        )}
        {step === 'setAddresses' && (
          <RegisterFormAddresses
            handleSetAddressesStep={handleSetAddressesStep}
            registrationFormData={registrationFormData}
            handleRegistrationDataChange={handleRegistrationDataChange}
            isShippingAddressFormDisplayed={isShippingAddressFormDisplayed}
            toggleShippingAddressForm={toggleShippingAddressForm}
          />
        )}
        {step === 'successfulRegistration' && (
          <div className="register-success-message">
            <h2>Sikeres regisztráció!</h2>
          </div>
        )}
      </div>
    </>
  )
}

