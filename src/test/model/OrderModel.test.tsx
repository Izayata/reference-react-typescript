import { OrderModel } from '../../main/model/OrderModel'
import { OrderItemModel } from '../../main/model/order/OrderItemModel'
import { CustomerModelBuilder } from '../../main/builder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../../main/builder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../../main/builder/AddressModelBuilder'
import { FirstnameModel } from '../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../main/model/customer/PhoneNumberModel'
import { EmailModel } from '../../main/model/EmailModel'
import { ZipCodeModel } from '../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../main/model/customer/address/CityModel'
import { StreetModel } from '../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../main/model/customer/address/StreetNumberModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'

// Valid models for composing OrderModel
const VALID_ADDRESS_MODEL = new AddressModelBuilder()
  .setZipCode(new ZipCodeModel('4028'))
  .setCity(new CityModel('Debrecen'))
  .setStreet(new StreetModel('Egyetem sgt'))
  .setStreetNumber(new StreetNumberModel('1'))
  .setFloorDoor(null)
  .build()
const VALID_CUSTOMER_MODEL = new CustomerModelBuilder()
  .setPersonalDetails(new PersonalDetailsModelBuilder()
    .setFirstname(new FirstnameModel('Test'))
    .setLastname(new LastnameModel('User'))
    .setPhoneNumber(new PhoneNumberModel('+36204234442'))
    .build())
  .setEmail(new EmailModel('test@example.com'))
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()
const VALID_ORDER_ITEMS = [new OrderItemModel(1, 2)]
const VALID_PAYMENT_TYPE = 'CASH'

// Invalid cases
const ERR_ORDER_MODEL_CUSTOMER_UNDEFINED = () => new OrderModel(undefined as any, VALID_ORDER_ITEMS, VALID_PAYMENT_TYPE)
const ERR_ORDER_MODEL_CUSTOMER_NULL = () => new OrderModel(null as any, VALID_ORDER_ITEMS, VALID_PAYMENT_TYPE)
const ERR_ORDER_MODEL_ORDER_ITEMS_UNDEFINED = () => new OrderModel(VALID_CUSTOMER_MODEL, undefined as any, VALID_PAYMENT_TYPE)
const ERR_ORDER_MODEL_ORDER_ITEMS_NULL = () => new OrderModel(VALID_CUSTOMER_MODEL, null as any, VALID_PAYMENT_TYPE)
const ERR_ORDER_MODEL_PAYMENT_TYPE_UNDEFINED = () => new OrderModel(VALID_CUSTOMER_MODEL, VALID_ORDER_ITEMS, undefined as any)
const ERR_ORDER_MODEL_PAYMENT_TYPE_NULL = () => new OrderModel(VALID_CUSTOMER_MODEL, VALID_ORDER_ITEMS, null as any)

// Valid case
const VALID_ORDER_MODEL = () => new OrderModel(VALID_CUSTOMER_MODEL, VALID_ORDER_ITEMS, VALID_PAYMENT_TYPE)

describe('OrderModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined customer', () => {
    expectErrorMessages(
      ERR_ORDER_MODEL_CUSTOMER_UNDEFINED,
      ['Customer email is required (undefined)'],
      1
    )
  })

  it('should throw required error for null customer', () => {
    expectErrorMessages(
      ERR_ORDER_MODEL_CUSTOMER_NULL,
      ['Customer email is required (null)'],
      1
    )
  })

  it('should throw required error for undefined orderItems', () => {
    expectErrorMessages(
      ERR_ORDER_MODEL_ORDER_ITEMS_UNDEFINED,
      ['Order items are required (undefined)'],
      1
    )
  })

  it('should throw required error for null orderItems', () => {
    expectErrorMessages(
      ERR_ORDER_MODEL_ORDER_ITEMS_NULL,
      ['Order items are required (null)'],
      1
    )
  })

  it('should throw required error for undefined paymentType', () => {
    expectErrorMessages(
      ERR_ORDER_MODEL_PAYMENT_TYPE_UNDEFINED,
      ['Payment type is required (undefined)'],
      1
    )
  })

  it('should throw required error for null paymentType', () => {
    expectErrorMessages(
      ERR_ORDER_MODEL_PAYMENT_TYPE_NULL,
      ['Payment type is required (null)'],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid order', () => {
    expect(VALID_ORDER_MODEL).not.toThrow()
  })

  it('does not carry any field beyond customer, orderItems, and paymentType', () => {
    // Regression-style check: OrderModel used to also carry an undocumented
    // isAuthenticatedUser field. Guards against it (or any other extra field)
    // silently reappearing in the serialized request body.
    const order = VALID_ORDER_MODEL()
    expect(Object.keys(order).sort()).toEqual(['customer', 'orderItems', 'paymentType'])
  })
})
