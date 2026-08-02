import { RegistrationModelBuilder } from './RegistrationModelBuilder'
import { MyUserRegistrationModelBuilder } from '../MyUserRegistrationModelBuilder/MyUserRegistrationModelBuilder'
import { PersonalDetailsModelBuilder } from '../PersonalDetailsModelBuilder/PersonalDetailsModelBuilder'
import { AddressModelBuilder } from '../AddressModelBuilder/AddressModelBuilder'
import { NewPasswordDetailsModelBuilder } from '../NewPasswordDetailsModelBuilder/NewPasswordDetailsModelBuilder'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'
import { expectSetterReturnsSameInstance } from '../../utils/test/ExpectSetterChaining'
import { ERR_MSG_MY_USER_REQUIRED } from '../../utils/MyUserRegistrationUtils'
import { ERR_MSG_PERSONAL_DETAILS_REQUIRED } from '../../utils/PersonalDetailsUtils'
import { ERR_MSG_SHIPPING_ADDRESS_REQUIRED, ERR_MSG_BILLING_ADDRESS_REQUIRED } from '../../utils/customer/AddressUtils'
import { EmailModel } from '../../model/EmailModel'
import { UsernameModel } from '../../model/myUser/UsernameModel'
import { PasswordModel } from '../../model/myUser/PasswordModel'
import { FirstnameModel } from '../../model/customer/FirstnameModel'
import { LastnameModel } from '../../model/customer/LastnameModel'
import { PhoneNumberModel } from '../../model/customer/PhoneNumberModel'
import { ZipCodeModel } from '../../model/customer/address/ZipCodeModel'
import { CityModel } from '../../model/customer/address/CityModel'
import { StreetModel } from '../../model/customer/address/StreetModel'
import { StreetNumberModel } from '../../model/customer/address/StreetNumberModel'

const VALID_PASSWORD = new PasswordModel('ValidPass123!')
// Valid models for composing RegistrationModel
const VALID_MY_USER_MODEL = new MyUserRegistrationModelBuilder()
  .setEmail(new EmailModel('test@example.com'))
  .setMyUsername(new UsernameModel('testuser'))
  .setNewPasswordDetails(
    new NewPasswordDetailsModelBuilder()
      .setNewPassword(VALID_PASSWORD)
      .setConfirmNewPassword(VALID_PASSWORD)
      .build()
  )
  .build()
const VALID_PERSONAL_DETAILS_MODEL = new PersonalDetailsModelBuilder()
  .setFirstname(new FirstnameModel('János'))
  .setLastname(new LastnameModel('Kovács'))
  .setPhoneNumber(new PhoneNumberModel('+36201234567'))
  .build()
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
const ERR_REGISTRATION_MODEL_BUILDER_MY_USER_UNDEFINED = () => new RegistrationModelBuilder()
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

  it('setPersonalDetails returns the same builder instance for chaining', () => {
    const builder = new RegistrationModelBuilder()
    expectSetterReturnsSameInstance(builder, b => b.setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL))
  })

  it('overwrites a previously set field when setPersonalDetails is called again, supporting incremental use across renders (e.g. Register.tsx\'s useRef)', () => {
    const OTHER_PERSONAL_DETAILS_MODEL = new PersonalDetailsModelBuilder()
      .setFirstname(new FirstnameModel('Anna'))
      .setLastname(new LastnameModel('Szabó'))
      .setPhoneNumber(new PhoneNumberModel('+36301234567'))
      .build()

    const result = new RegistrationModelBuilder()
      .setMyUser(VALID_MY_USER_MODEL)
      .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
      .setPersonalDetails(OTHER_PERSONAL_DETAILS_MODEL)
      .setShippingAddress(VALID_SHIPPING_ADDRESS_MODEL)
      .setBillingAddress(VALID_BILLING_ADDRESS_MODEL)
      .build()

    expect(result.personalDetails.firstname.value).toBe('Anna')
  })
})
