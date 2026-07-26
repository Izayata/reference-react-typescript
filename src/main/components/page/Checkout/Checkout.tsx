import { useEffect, useState } from 'react'
import { ShoppingCartItemModel } from '../../../model/ShoppingCartItemModel'
import { useModal } from '../../../context/ModalMessageContext/ModalMessageContext'
import { fetchFoodsByIds } from '../ShoppingCart/ShoppingCart'
import { sleep } from '../../../utils/sleep/SleepUtils'
import { useNavigate } from 'react-router'
import { LoadingOverlay } from '../../functional/LoadingOverlay/LoadingOverlay'
import { fetchAuthenticatedUserDetails } from '../../../utils/pages/account/accountPageUtils'
import { MyUserModel } from '../../../model/MyUserModel'

import './css/personal-information/personal-information-element-container.css'
import './css/personal-information/personal-information-element-phone-number.css'
import './css/checkout-content-container.css'
import './css/checkout-section-title.css'
import './css/checkout-order-item-list-container.css'
import './css/checkout-order-item-price-container.css'
import './css/checkout-order-price-container.css'
import '../../../css/shared/form/form-container.css'
import '../../../css/button/application-button-style.css'

import { AddressInput } from '../../input/customer/address/AddressInput'
import { convertBillingAddressFormDataToFormData, convertShippingAddressFormDataToFormData } from '../../../converter/formDataConverter'
import { PersonalDetailsInput } from '../../input/customer/PersonalDetailsInput'
import { NavLink } from 'react-router-dom'
import { OrderItemModel } from '../../../model/order/OrderItemModel'
import { OrderModel } from '../../../model/OrderModel'
import { CustomerModel } from '../../../model/CustomerModel'
import { CustomerModelBuilder } from '../../../builder/CustomerModelBuilder'
import { EmailModel } from '../../../model/EmailModel'
import { AddressModel } from '../../../model/customer/AddressModel'
import { AddressModelBuilder } from '../../../builder/AddressModelBuilder'
import { ZipCodeModel } from '../../../model/customer/address/ZipCodeModel'
import { CityModel } from '../../../model/customer/address/CityModel'
import { StreetNumberModel } from '../../../model/customer/address/StreetNumberModel'
import { StreetModel } from '../../../model/customer/address/StreetModel'
import { FloorDoorModel } from '../../../model/customer/address/FloorDoorModel'
import { PersonalDetailsModelBuilder } from '../../../builder/PersonalDetailsModelBuilder'
import { FirstnameModel } from '../../../model/customer/FirstnameModel'
import { LastnameModel } from '../../../model/customer/LastnameModel'
import { PhoneNumberModel } from '../../../model/customer/PhoneNumberModel'
import { EmailInput } from '../../input/myUser/EmailInput/EmailInput'
import { handleErrorMessages } from '../../../utils/ErrorUtils'
import { send } from 'process'
import { fetchCsrfToken } from '../../../supports/fetch-utilities/fetchCsrfToken'

interface CheckoutProps {
  isAuthenticated: boolean
}

export const Checkout: React.FC<CheckoutProps> = ({ isAuthenticated }) => {
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
  let orderItem: OrderItemModel
  const orderItems: OrderItemModel[] = []
  let orderTotal = 0
  let orderItemTotal = 0
  
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
    await sleep(1000)

    if (!myUserData) {
      return
    }

    myUserData.customer.shippingAddress.zipCode.value = shippingAddressForm.shippingZipCode
    myUserData.customer.shippingAddress.city.value = shippingAddressForm.shippingCity
    myUserData.customer.shippingAddress.street.value = shippingAddressForm.shippingStreet
    myUserData.customer.shippingAddress.streetNumber.value = shippingAddressForm.shippingStreetNumber
    if (myUserData.customer.shippingAddress.floorDoor) {
      myUserData.customer.shippingAddress.floorDoor.value = shippingAddressForm.shippingFloorDoor
    }

    setEditMode(false)
    setLoading(false)
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

  if (foods.length === 0 && !loading) {
    navigate('/cart')
  }

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
      {console.log('isCashPayment: ', isCashPayment)}
      {console.log('isCardPayment: ', isCardPayment)}
      {console.log('paymentType: ', paymentType)}
      if (paymentType === 'unknown' || (!isCashPayment && !isCardPayment)) {
        throw new Error('Kérjük, válasszon fizetési módot!')
      }

      return new OrderModel(
        getCustomer(),
        orderItems,
        paymentType,
        isAuthenticated
      )
    } catch (e: any) {
      setModalMessage(handleErrorMessages(e))
    }
  }

  const sendOrderToServer = async (order: OrderModel) => {
    if (!order) {
      throw new Error('Az order objektum hiányzik vagy érvénytelen!')
    }

    try {
      const response = await fetch('/v1/orders/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': await fetchCsrfToken()
        },
        body: JSON.stringify(order)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Hiba történt a rendelés feldolgozása során.')
      }

      const data = await response.json()
      localStorage.removeItem('shopping_cart')
      setCheckoutState('success')
      return data
    } catch (error: any) {
      setModalMessage(handleErrorMessages(error))
      throw error
    }
  }

  const submitOrder = async () => {
    try {
      setLoading(true)
      const order = getOrderToSubmit()
      if (!order) {
        throw new Error('A rendelés adatai hiányosak vagy érvénytelenek!')
      }
      console.log('Order submitted:', order)
      await sendOrderToServer(order)
    } catch (e: any) {
      handleErrorMessages(e)
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
        <h2 className='page-title'>Pénztár</h2>
        <div className='checkout-content-container'>
          <section className='form-container checkout-page customer-details'>
            {isAuthenticated && !editMode &&(
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
                  onClick={handleEdit}
                  type="button"
                >
                  Módosítás
                </button>
              </>
            )}
            {isAuthenticated && editMode && (
              <form onSubmit={handleSave} className="form-container" style={{animation: 'none'}}>
                <AddressInput formData={convertShippingAddressFormDataToFormData(shippingAddressForm)} onChange={handleChange} />
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                  <button className="application-button-style" type="submit">Mentés</button>
                  <button className="application-button-style" type="button" onClick={handleCancel}>Mégse</button>
                </div>
              </form>
            )}
            {!isAuthenticated && (
              <form className='form-container' style={{animation: 'none'}}>
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
                <PersonalDetailsInput formData={personalDetailsForm} onChange={handlePersonalDetailsChange}/>
                <EmailInput value={emailForm.email} onChange={handleEmailChange}/>
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
                <AddressInput formData={convertBillingAddressFormDataToFormData(billingAddressForm)} onChange={handleBillingChange} />
                <div
                  style={{textWrap: 'pretty'}}
                  onClick={() => setBillingAddressSameAsShipping(!billingAddressSameAsShipping)}
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
                    <AddressInput formData={convertShippingAddressFormDataToFormData(shippingAddressForm)} onChange={handleChange} />
                  </>
                )}
                
              </form>
            )}
          </section>
          <section className='form-container checkout-page order-summary'>
            <>
              <div>
                <h3 className='checkout-section-title'>Tételek</h3>
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
              <div>
                {foods.map(food => (
                  <>
                    <div key={food.foodId} className='checkout-order-item-list-container'>
                      <div>
                        {(() => {
                          orderItem = new OrderItemModel(food.foodId, quantities[food.foodId])
                          orderItems.push(orderItem)
                          return null
                        })()}
                        ×{orderItem.quantity} | {food.foodName.value}
                      </div>
                      {(() => {
                        orderItemTotal = Number(food.price.amount) * Number(quantities[food.foodId])
                        return null
                      })()}
                      <div className='checkout-order-item-price-container'>{(orderItemTotal).toFixed(0)} Ft</div>
                      {(() => {
                        orderTotal += orderItemTotal
                        return null
                      })()}
                    </div>
                  </>
                ))}
                <div
                  style={{
                    width: 'calc(100% - 2rem)',
                    border: '.5px solid',
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
              <div className='checkout-order-price-container'>
                <strong>
                  Összesen fizetendő:
                </strong>
                <strong>{orderTotal} Ft</strong>
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
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                Fizetés kiszállításkor a következő módon:
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span
                    onClick={setPaymentToCash}
                    style={{cursor: 'pointer'}}
                  >
                    <input
                      type='checkbox'
                      checked={isCashPayment}
                    />
                    Készpénz
                  </span>
                  <span
                    onClick={setPaymentToCard}
                    style={{cursor: 'pointer'}}
                  >
                    <input
                      type='checkbox'
                      checked={isCardPayment}
                    />
                    Bankkártya
                  </span>
                </div>
              </div>
            </>
            <section style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <NavLink
                className='application-button-style animated'
                to='/cart'
                style={{textDecoration: 'none'}}
              >
                Kosár
              </NavLink>
              <div className='application-button-style animated' onClick={submitOrder}>
                Megrendel
              </div>
            </section>
          </section>
        </div>
      </>
    )
      :
      (
        <h1 className='page-title'>Megrendelés sikeresen leadva!</h1>
      )
  )
}

