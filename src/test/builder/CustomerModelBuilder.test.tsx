import { CustomerModelBuilder } from '../../main/builder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../../main/builder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../../main/builder/AddressModelBuilder'
import { EmailModel } from '../../main/model/EmailModel'
import { FirstnameModel } from '../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../main/model/customer/PhoneNumberModel'
import { ZipCodeModel } from '../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../main/model/customer/address/CityModel'
import { StreetModel } from '../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../main/model/customer/address/StreetNumberModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { ERR_MSG_PERSONAL_DETAILS_REQUIRED } from '../../main/utils/PersonalDetailsUtils'
import { ERR_MSG_EMAIL_REQUIRED } from '../../main/utils/EmailUtils'
import { ERR_MSG_SHIPPING_ADDRESS_REQUIRED, ERR_MSG_BILLING_ADDRESS_REQUIRED } from '../../main/utils/customer/AddressUtils'

// Valid models for composing CustomerModel
const VALID_PERSONAL_DETAILS_MODEL = new PersonalDetailsModelBuilder()
  .setFirstname(new FirstnameModel('János'))
  .setLastname(new LastnameModel('Kovács'))
  .setPhoneNumber(new PhoneNumberModel('+36201234567'))
  .build()

const VALID_EMAIL_MODEL = new EmailModel('janos.kovacs@example.com')

const VALID_SHIPPING_ADDRESS_MODEL = new AddressModelBuilder()
  .setZipCode(new ZipCodeModel('4032'))
  .setCity(new CityModel('Debrecen'))
  .setStreet(new StreetModel('Kossuth Lajos utca'))
  .setStreetNumber(new StreetNumberModel('21'))
  .build()

const VALID_BILLING_ADDRESS_MODEL = new AddressModelBuilder()
  .setZipCode(new ZipCodeModel('4032'))
  .setCity(new CityModel('Debrecen'))
  .setStreet(new StreetModel('Kossuth Lajos utca'))
  .setStreetNumber(new StreetNumberModel('21'))
  .build()

// Invalid cases
const ERR_CUSTOMER_MODEL_BUILDER_PERSONAL_DETAILS_UNDEFINED = () => new CustomerModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BUILDER_PERSONAL_DETAILS_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(null as any)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BUILDER_EMAIL_UNDEFINED = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BUILDER_EMAIL_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(null as any)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BUILDER_SHIPPING_ADDRESS_UNDEFINED = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BUILDER_SHIPPING_ADDRESS_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(null as any)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BILLING_ADDRESS_UNDEFINED = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BUILDER_BILLING_ADDRESS_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(null as any)
  .build()

// Valid case
const VALID_CUSTOMER_MODEL_BUILDER = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

describe('CustomerModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined personalDetails', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BUILDER_PERSONAL_DETAILS_UNDEFINED,
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null personalDetails', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BUILDER_PERSONAL_DETAILS_NULL,
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined email', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BUILDER_EMAIL_UNDEFINED,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for null email', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BUILDER_EMAIL_NULL,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined shippingAddress', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BUILDER_SHIPPING_ADDRESS_UNDEFINED,
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for null shippingAddress', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BUILDER_SHIPPING_ADDRESS_NULL,
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined billingAddress', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BILLING_ADDRESS_UNDEFINED,
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for null billingAddress', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BUILDER_BILLING_ADDRESS_NULL,
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid customer model', () => {
    expect(VALID_CUSTOMER_MODEL_BUILDER).not.toThrow()
  })
})
