import { RegistrationModelBuilder } from '../../main/builder/RegistrationModelBuilder'
import { MyUserRegistrationModel } from '../../main/model/MyUserRegistrationModel'
import { PersonalDetailsModel } from '../../main/model/PersonalDetailsModel'
import { AddressModel } from '../../main/model/customer/AddressModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { ERR_MSG_MY_USER_REQUIRED } from '../../main/utils/MyUserRegistrationUtils'
import { ERR_MSG_PERSONAL_DETAILS_REQUIRED } from '../../main/utils/PersonalDetailsUtils'
import { ERR_MSG_SHIPPING_ADDRESS_REQUIRED, ERR_MSG_BILLING_ADDRESS_REQUIRED } from '../../main/utils/customer/AddressUtils'
import { EmailModel } from '../../main/model/EmailModel'
import { UsernameModel } from '../../main/model/myUser/UsernameModel'
import { PasswordModel } from '../../main/model/myUser/PasswordModel'
import { NewPasswordDetailsModel } from '../../main/model/NewPasswordDetailsModel'
import { FirstnameModel } from '../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../main/model/customer/PhoneNumberModel'
import { ZipCodeModel } from '../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../main/model/customer/address/CityModel'
import { StreetModel } from '../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../main/model/customer/address/StreetNumberModel'

const VALID_PASSWORD = new PasswordModel('ValidPass123!')
// Valid models for composing RegistrationModel
const VALID_MY_USER_MODEL = new MyUserRegistrationModel(
  new EmailModel('test@example.com'),
  new UsernameModel('testuser'),
  new NewPasswordDetailsModel(VALID_PASSWORD, VALID_PASSWORD)
)
const VALID_PERSONAL_DETAILS_MODEL = new PersonalDetailsModel(
  new FirstnameModel('János'),
  new LastnameModel('Kovács'),
  new PhoneNumberModel('+36201234567')
)
const VALID_SHIPPING_ADDRESS_MODEL = new AddressModel(
  new ZipCodeModel('4032'),
  new CityModel('Debrecen'),
  new StreetModel('Kossuth Lajos utca'),
  new StreetNumberModel('21')
)
const VALID_BILLING_ADDRESS_MODEL = new AddressModel(
  new ZipCodeModel('4032'),
  new CityModel('Debrecen'),
  new StreetModel('Kossuth Lajos utca'),
  new StreetNumberModel('21')
)

// Invalid cases
const ERR_REGISTRATION_MODEL_BUILDER_MY_USER_UNDEFINED = () => new RegistrationModelBuilder()
  .setMyUser(undefined as any)
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_REGISTRATION_MODEL_BUILDER_MY_USER_NULL = () => new RegistrationModelBuilder()
  .setMyUser(null as any)
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_REGISTRATION_MODEL_BUILDER_PERSONAL_DETAILS_UNDEFINED = () => new RegistrationModelBuilder()
  .setMyUser(VALID_MY_USER_MODEL)
  .setPersonalDetails(undefined as any)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_REGISTRATION_MODEL_BUILDER_PERSONAL_DETAILS_NULL = () => new RegistrationModelBuilder()
  .setMyUser(VALID_MY_USER_MODEL)
  .setPersonalDetails(null as any)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_REGISTRATION_MODEL_BUILDER_SHIPPING_ADDRESS_UNDEFINED = () => new RegistrationModelBuilder()
  .setMyUser(VALID_MY_USER_MODEL)
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(undefined as any)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_REGISTRATION_MODEL_BUILDER_SHIPPING_ADDRESS_NULL = () => new RegistrationModelBuilder()
  .setMyUser(VALID_MY_USER_MODEL)
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(null as any)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

const ERR_REGISTRATION_MODEL_BUILDER_BILLING_ADDRESS_UNDEFINED = () => new RegistrationModelBuilder()
  .setMyUser(VALID_MY_USER_MODEL)
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(undefined as any)
  .build()

const ERR_REGISTRATION_MODEL_BUILDER_BILLING_ADDRESS_NULL = () => new RegistrationModelBuilder()
  .setMyUser(VALID_MY_USER_MODEL)
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(null as any)
  .build()

// Valid case
const VALID_REGISTRATION_MODEL_BUILDER = () => new RegistrationModelBuilder()
  .setMyUser(VALID_MY_USER_MODEL)
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
  .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
  .build()

describe('RegistrationModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined myUser', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_MY_USER_UNDEFINED,
      [ERR_MSG_MY_USER_REQUIRED],
      1
    )
  })

  it('should throw required error for null myUser', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_MY_USER_NULL,
      [ERR_MSG_MY_USER_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined personalDetails', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_PERSONAL_DETAILS_UNDEFINED,
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null personalDetails', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_PERSONAL_DETAILS_NULL,
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined shippingAddress', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_SHIPPING_ADDRESS_UNDEFINED,
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for null shippingAddress', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_SHIPPING_ADDRESS_NULL,
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined billingAddress', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_BILLING_ADDRESS_UNDEFINED,
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for null billingAddress', () => {
    expectErrorMessages(
      ERR_REGISTRATION_MODEL_BUILDER_BILLING_ADDRESS_NULL,
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid registration model', () => {
    expect(VALID_REGISTRATION_MODEL_BUILDER).not.toThrow()
  })
})
