import { EmailModel } from '../../main/model/EmailModel'
import { AddressModel } from '../../main/model/customer/AddressModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { ERR_MSG_EMAIL_REQUIRED } from '../../main/utils/EmailUtils'
import { ERR_MSG_BILLING_ADDRESS_REQUIRED, ERR_MSG_SHIPPING_ADDRESS_REQUIRED } from '../../main/utils/customer/AddressUtils'
import { CustomerModelBuilder } from '../../main/builder/CustomerModelBuilder'
import { PersonalDetailsModel } from '../../main/model/PersonalDetailsModel'
import { ERR_MSG_PERSONAL_DETAILS_REQUIRED } from '../../main/utils/PersonalDetailsUtils'
import { FirstnameModel } from '../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../main/model/customer/PhoneNumberModel'
import { PersonalDetailsModelBuilder } from '../../main/builder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../../main/builder/AddressModelBuilder'
import { ZipCodeModel } from '../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../main/model/customer/address/CityModel'
import { StreetModel } from '../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../main/model/customer/address/StreetNumberModel'

// Valid models for composing CustomerModel
const VALID_PERSONAL_DETAILS_MODEL = new PersonalDetailsModelBuilder()
  .setFirstname(new FirstnameModel('Anna'))
  .setLastname(new LastnameModel('Kovács'))
  .setPhoneNumber(new PhoneNumberModel('+36201234567'))
  .build()
const VALID_EMAIL_MODEL = new EmailModel('anna.kovacs@example.com')
const VALID_ADDRESS_MODEL = new AddressModelBuilder()
  .setZipCode(new ZipCodeModel('4032'))
  .setCity(new CityModel('Debrecen'))
  .setStreet(new StreetModel('Kossuth Lajos utca'))
  .setStreetNumber(new StreetNumberModel('21'))
  .build()

// Invalid cases
const ERR_CUSTOMER_MODEL_PERSONAL_DETAILS_UNDEFINED = () => new CustomerModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_PERSONAL_DETAILS_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(null as any)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_EMAIL_UNDEFINED = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_EMAIL_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(null as any)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_SHIPPING_ADDRESS_UNDEFINED = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_SHIPPING_ADDRESS_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(null as any)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BILLING_ADDRESS_UNDEFINED = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .build()

const ERR_CUSTOMER_MODEL_BILLING_ADDRESS_NULL = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(null as any)
  .build()

// Valid case
const VALID_CUSTOMER_MODEL = () => new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

describe('CustomerModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined personalDetails', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_PERSONAL_DETAILS_UNDEFINED,
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null personalDetails', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_PERSONAL_DETAILS_NULL,
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined email', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_EMAIL_UNDEFINED,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })
  
  it('should throw required error for null email', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_EMAIL_NULL,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined shipping address', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_SHIPPING_ADDRESS_UNDEFINED,
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })
  
  it('should throw required error for null shipping address', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_SHIPPING_ADDRESS_NULL,
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined billing address', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BILLING_ADDRESS_UNDEFINED,
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })
  
  it('should throw required error for null billing address', () => {
    expectErrorMessages(
      ERR_CUSTOMER_MODEL_BILLING_ADDRESS_NULL,
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid customer with required fields only', () => {
    expect(VALID_CUSTOMER_MODEL).not.toThrow()
  })
})
