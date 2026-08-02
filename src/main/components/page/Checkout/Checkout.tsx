import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoppingCartItemModel } from '../../../model/ShoppingCartItemModel'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { fetchFoodsByIds } from '../ShoppingCart/ShoppingCart'
import { sleep } from '../../../utils/sleep/SleepUtils'
import { useNavigate } from 'react-router'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { fetchAuthenticatedUserDetails } from '../../../utils/pages/account/accountPageUtils'
import { MyUserModel } from '../../../model/MyUserModel'

import './Checkout.css'
import '../../../css/shared/form/form-container.css'
import '../../../css/button/application-button-style.css'

import { OrderItemModel } from '../../../model/order/OrderItemModel'
import { OrderModel } from '../../../model/OrderModel'
import { CustomerModelBuilder } from '../../../builder/CustomerModelBuilder/CustomerModelBuilder'
import { EmailModel } from '../../../model/EmailModel'
import { AddressModelBuilder } from '../../../builder/AddressModelBuilder/AddressModelBuilder'
import { ZipCodeModel } from '../../../model/customer/address/ZipCodeModel'
import { CityModel } from '../../../model/customer/address/CityModel'
import { StreetNumberModel } from '../../../model/customer/address/StreetNumberModel'
import { StreetModel } from '../../../model/customer/address/StreetModel'
import { FloorDoorModel } from '../../../model/customer/address/FloorDoorModel'
import { PersonalDetailsModelBuilder } from '../../../builder/PersonalDetailsModelBuilder/PersonalDetailsModelBuilder'
import { FirstnameModel } from '../../../model/customer/FirstnameModel'
import { LastnameModel } from '../../../model/customer/LastnameModel'
import { PhoneNumberModel } from '../../../model/customer/PhoneNumberModel'
import { handleErrorMessages } from '../../../utils/ErrorUtils'
import { fetchCsrfToken } from '../../../supports/fetch-utilities/fetchCsrfToken'
import { convertShippingAddressFormToAddressModel } from '../../../converter/AddressModelConverter'
import { CheckoutCustomerDetailsSection } from './CheckoutCustomerDetailsSection'
import { CheckoutOrderSummarySection } from './CheckoutOrderSummarySection'

interface CheckoutProps {
  isAuthenticated: boolean
}

export const Checkout: React.FC<CheckoutProps> = ({ isAuthenticated }) => {
  const { t } = useTranslation()
  const [checkoutState, setCheckoutState] = useState<'data' | 'success'>('data')
  const [foods, setFoods] = useState<ShoppingCartItemModel[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [shippingAddressForm, setShippingAddressForm] = useState(getInitialForm())
  const [billingAddressForm, setBillingAddressForm] = useState(getInitialFormBilling())
  const [personalDetailsForm, setPersonalDetailsForm] = useState(getPersonalDetailsInitialForm())
  const [emailForm, setEmailForm] = useState({ email: '' })
  const [myUserData, setCustomerData] = useState<MyUserModel | null>(null)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [paymentType, setPaymentType] = useState('unknown')
  const [isCashPayment, setIsCashPayment] = useState(false)
  const [isCardPayment, setIsCardPayment] = useState(false)
  const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(false)
  const { setModalMessage } = useModal()
  const navigate = useNavigate()
  const orderItems = useMemo(
    () => foods.map(food => new OrderItemModel(food.foodId, quantities[food.foodId])),
    [foods, quantities]
  )

  const fetchCustomerData = async () => {
    setLoading(true)
    await sleep(1000)
    fetchAuthenticatedUserDetails()
      .then(setCustomerData)
      .catch(setModalMessage)
      .finally(() => setLoading(false))
  }

  const fetchData = async () => {
    const stored = localStorage.getItem('shopping_cart')
    if (stored) {
      const cart = JSON.parse(stored)
      const foodIds = Object.keys(cart)
      if (foodIds.length > 0) {
        fetchFoodsByIds(foodIds)
          .then(setFoods)
          .catch(err => setModalMessage(err.message))
          .finally(async () => {
            await sleep(1500)
            setLoading(false)
          })
      } else {
        setFoods([])
        await sleep(1500)
        setLoading(false)
      }
    } else {
      setFoods([])
      await sleep(1500)
      setLoading(false)
    }
  }

  function getInitialFormBilling() {
    return {
      billingZipCode: '',
      billingCity: '',
      billingStreet: '',
      billingStreetNumber: '',
      billingFloorDoor: ''
    }
  }

  function getInitialForm() {
    return {
      shippingZipCode: '',
      shippingCity: '',
      shippingStreet: '',
      shippingStreetNumber: '',
      shippingFloorDoor: ''
    }
  }

  function getPersonalDetailsInitialForm() {
    return {
      firstname: '',
      lastname: '',
      phoneNumber: '',
      email: ''
    }
  }

  const handleEdit = () => {
    setEditMode(true)
    setModalMessage(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalMessage(null)
    setLoading(true)

    try {
      if (!myUserData) {
        return
      }

      const newAddress = convertShippingAddressFormToAddressModel(shippingAddressForm)

      const res = await fetch('/v1/customer/shipping-address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': await fetchCsrfToken()
        },
        credentials: 'include',
        body: JSON.stringify(newAddress)
      })

      if (!res.ok) throw new Error(t('checkout.shippingAddressSaveError'))

      myUserData.customer.shippingAddress = newAddress
      await sleep(1000)
      setEditMode(false)
    } catch (e: unknown) {
      setModalMessage(handleErrorMessages(e))
    } finally {
      setLoading(false)
    }
  }

  const shippingFieldMap: Record<string, string> = {
    zip: 'shippingZipCode',
    city: 'shippingCity',
    street: 'shippingStreet',
    streetNumber: 'shippingStreetNumber',
    floorDoor: 'shippingFloorDoor'
  }

  const billingFieldMap: Record<string, string> = {
    zip: 'billingZipCode',
    city: 'billingCity',
    street: 'billingStreet',
    streetNumber: 'billingStreetNumber',
    floorDoor: 'billingFloorDoor'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const mappedName = shippingFieldMap[name] || name
    setShippingAddressForm({ ...shippingAddressForm, [mappedName]: value })
  }

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const mappedName = billingFieldMap[name] || name
    setBillingAddressForm({ ...billingAddressForm, [mappedName]: value })
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailForm({ ...emailForm, [name]: value })
  }

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalDetailsForm({ ...personalDetailsForm, [name]: value })
  }

  const handleCancel = () => {
    setEditMode(false)
    setShippingAddressForm(getInitialForm())
    setModalMessage(null)
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
  }, [])

  useEffect(() => {
    if (isAuthenticated && foods.length > 0) {
      fetchCustomerData()
    }
  }, [foods, isAuthenticated])

  useEffect(() => {
    const stored = localStorage.getItem('shopping_cart')
    if (stored) {
      const cart = JSON.parse(stored)
      setQuantities(cart)
    }
  }, [])

  useEffect(() => {
    if (foods.length === 0 && !loading) {
      navigate('/cart')
    }
  }, [foods, loading, navigate])

  if (loading) return <LoadingOverlay/>

  const getCustomer = () => {
    return new CustomerModelBuilder()
      .setPersonalDetails(new PersonalDetailsModelBuilder()
        .setFirstname(new FirstnameModel(
          isAuthenticated ? (myUserData?.customer.personalDetails.firstname.value ?? '') : (personalDetailsForm.firstname ?? '')
        ))
        .setLastname(new LastnameModel(
          isAuthenticated ? (myUserData?.customer.personalDetails.lastname.value ?? '') : (personalDetailsForm.lastname ?? '')
        ))
        .setPhoneNumber(new PhoneNumberModel(
          isAuthenticated ? (myUserData?.customer.personalDetails.phoneNumber.value ?? '') : (personalDetailsForm.phoneNumber ?? '')
        ))
        .build()
      )
      .setEmail(new EmailModel(
        isAuthenticated ? (myUserData?.customer.email.value ?? '') : (emailForm.email ?? '')
      ))
      .setBillingAddress(
        new AddressModelBuilder()
          .setZipCode(new ZipCodeModel(
            isAuthenticated ? (myUserData?.customer.billingAddress.zipCode.value ?? '') : (billingAddressForm.billingZipCode ?? '')
          ))
          .setCity(new CityModel(
            isAuthenticated ? (myUserData?.customer.billingAddress.city.value ?? '') : (billingAddressForm.billingCity ?? '')
          ))
          .setStreet(new StreetModel(
            isAuthenticated ? (myUserData?.customer.billingAddress.street.value ?? '') : (billingAddressForm.billingStreet ?? '')
          ))
          .setStreetNumber(new StreetNumberModel(
            isAuthenticated ? (myUserData?.customer.billingAddress.streetNumber.value ?? '') : (billingAddressForm.billingStreetNumber ?? '')
          ))
          .setFloorDoor(
            isAuthenticated && myUserData?.customer.billingAddress.floorDoor?.value ?
              (new FloorDoorModel(myUserData?.customer.billingAddress.floorDoor.value))
              : !isAuthenticated && billingAddressForm.billingFloorDoor ?
                (new FloorDoorModel(billingAddressForm.billingFloorDoor))
                : null
          )
          .build()
      )
      .setShippingAddress(new AddressModelBuilder()
        .setZipCode(new ZipCodeModel(
          isAuthenticated ?
            (myUserData?.customer.shippingAddress.zipCode.value ?? '')
            : (billingAddressSameAsShipping ? (billingAddressForm.billingZipCode ?? '') : (shippingAddressForm.shippingZipCode ?? ''))
        ))
        .setCity(new CityModel(
          isAuthenticated ?
            (myUserData?.customer.shippingAddress.city.value ?? '')
            : (billingAddressSameAsShipping ? (billingAddressForm.billingCity ?? '') : (shippingAddressForm.shippingCity ?? ''))
        ))
        .setStreet(new StreetModel(
          isAuthenticated ?
            (myUserData?.customer.shippingAddress.street.value ?? '')
            : (billingAddressSameAsShipping ? (billingAddressForm.billingStreet ?? '') : (shippingAddressForm.shippingStreet ?? ''))
        ))
        .setStreetNumber(new StreetNumberModel(
          isAuthenticated ?
            (myUserData?.customer.shippingAddress.streetNumber.value ?? '')
            : (billingAddressSameAsShipping ? (billingAddressForm.billingStreetNumber ?? '') : (shippingAddressForm.shippingStreetNumber ?? ''))
        ))
        .setFloorDoor(
          isAuthenticated && myUserData?.customer.shippingAddress.floorDoor?.value ?
            (new FloorDoorModel(myUserData?.customer.shippingAddress.floorDoor.value))
            : !isAuthenticated && billingAddressSameAsShipping && billingAddressForm.billingFloorDoor ?
              (new FloorDoorModel(billingAddressForm.billingFloorDoor))
              : !isAuthenticated && !billingAddressSameAsShipping && shippingAddressForm.shippingFloorDoor ?
                (new FloorDoorModel(shippingAddressForm.shippingFloorDoor))
                : null
        )
        .build()
      )

      .build()
  }

  const getOrderToSubmit = () => {
    try {
      if (paymentType === 'unknown' || (!isCashPayment && !isCardPayment)) {
        throw new Error(t('checkout.paymentTypeRequired'))
      }

      return new OrderModel(
        getCustomer(),
        orderItems,
        paymentType
      )
    } catch (e: unknown) {
      setModalMessage(handleErrorMessages(e))
    }
  }

  const sendOrderToServer = async (order: OrderModel) => {
    if (!order) {
      throw new Error(t('checkout.missingOrderObject'))
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (isAuthenticated) {
        headers['X-CSRF-TOKEN'] = await fetchCsrfToken()
      }

      const response = await fetch(isAuthenticated ? '/v1/orders' : '/v1/orders/guest', {
        method: 'POST',
        headers,
        body: JSON.stringify(order)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || t('checkout.orderProcessingError'))
      }

      const data = await response.json()
      localStorage.removeItem('shopping_cart')
      setCheckoutState('success')
      return data
    } catch (error: unknown) {
      setModalMessage(handleErrorMessages(error))
      throw error
    }
  }

  const submitOrder = async () => {
    try {
      setLoading(true)
      const order = getOrderToSubmit()
      if (!order) {
        throw new Error(t('checkout.orderDataIncomplete'))
      }
      await sendOrderToServer(order)
    } catch (e: unknown) {
      setModalMessage(handleErrorMessages(e))
    } finally {
      setLoading(false)
    }

  }

  const setPaymentToCash = () => {
    const newCashPaymentValue = !isCashPayment
    setIsCashPayment(newCashPaymentValue)
    setIsCardPayment(false)
    setPaymentType(newCashPaymentValue ? 'CASH' : 'unknown')
  }

  const setPaymentToCard = () => {
    const newCardPaymentValue = !isCardPayment
    setIsCardPayment(newCardPaymentValue)
    setIsCashPayment(false)
    setPaymentType(newCardPaymentValue ? 'CARD' : 'unknown')
  }

  return (
    checkoutState === 'data' ? (
      <>
        <h1 className='page-title'>{t('checkout.pageTitle')}</h1>
        <div className='checkout-content-container'>
          <CheckoutCustomerDetailsSection
            isAuthenticated={isAuthenticated}
            editMode={editMode}
            myUserData={myUserData}
            shippingAddressForm={shippingAddressForm}
            billingAddressForm={billingAddressForm}
            personalDetailsForm={personalDetailsForm}
            emailForm={emailForm}
            billingAddressSameAsShipping={billingAddressSameAsShipping}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onShippingAddressChange={handleChange}
            onBillingAddressChange={handleBillingChange}
            onPersonalDetailsChange={handlePersonalDetailsChange}
            onEmailChange={handleEmailChange}
            onToggleBillingAddressSameAsShipping={() => setBillingAddressSameAsShipping(!billingAddressSameAsShipping)}
          />
          <CheckoutOrderSummarySection
            foods={foods}
            quantities={quantities}
            isCashPayment={isCashPayment}
            isCardPayment={isCardPayment}
            onSetPaymentToCash={setPaymentToCash}
            onSetPaymentToCard={setPaymentToCard}
            onSubmitOrder={submitOrder}
          />
        </div>
      </>
    )
      :
      (
        <h1 className='page-title'>{t('checkout.orderSuccessTitle')}</h1>
      )
  )
}
