import { EmailModel } from './EmailModel'
import { UsernameModel } from './myUser/UsernameModel'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { ERR_MSG_USERNAME_REQUIRED } from '../utils/myUser/UsernameUtils'
import { CustomerModelBuilder } from '../builder/CustomerModelBuilder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../builder/PersonalDetailsModelBuilder/PersonalDetailsModelBuilder'
import { FirstnameModel } from './customer/FirstnameModel'
import { LastnameModel } from './customer/LastnameModel'
import { PhoneNumberModel } from './customer/PhoneNumberModel'
import { AddressModelBuilder } from '../builder/AddressModelBuilder/AddressModelBuilder'
import { ZipCodeModel } from './customer/address/ZipCodeModel'
import { CityModel } from './customer/address/CityModel'
import { StreetModel } from './customer/address/StreetModel'
import { StreetNumberModel } from './customer/address/StreetNumberModel'
import { MyUserModelBuilder } from '../builder/MyUserModelBuilder/MyUserModelBuilder'
import { ERR_MSG_CUSTOMER_REQUIRED } from '../utils/MyUserModelUtils'

// Valid models for composing MyUserModel
const VALID_EMAIL_MODEL = new EmailModel('anna.kovacs@example.com')
const VALID_USERNAME_MODEL = new UsernameModel('testuser')
const VALID_PERSONAL_DETAILS_MODEL = new PersonalDetailsModelBuilder()
  .setFirstname(new FirstnameModel('Anna'))
  .setLastname(new LastnameModel('Kovács'))
  .setPhoneNumber(new PhoneNumberModel('+36201234567'))
  .build()
const VALID_ADDRESS_MODEL = new AddressModelBuilder()
  .setZipCode(new ZipCodeModel('4032'))
  .setCity(new CityModel('Debrecen'))
  .setStreet(new StreetModel('Kossuth Lajos utca'))
  .setStreetNumber(new StreetNumberModel('21'))
  .build()
const VALID_CUSTOMER_MODEL = new CustomerModelBuilder()
  .setPersonalDetails(VALID_PERSONAL_DETAILS_MODEL)
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

// Invalid cases
const ERR_MYUSER_EMAIL_UNDEFINED = () => new MyUserModelBuilder()
  .setEmail(undefined as any)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_EMAIL_NULL = () => new MyUserModelBuilder()
  .setEmail(null as any)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_USERNAME_UNDEFINED = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(undefined as any)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_USERNAME_NULL = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(null as any)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_CUSTOMER_UNDEFINED = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(undefined as any)
  .build()

const ERR_MYUSER_CUSTOMER_NULL = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(null as any)
  .build()

// Valid case
const VALID_MYUSER_MODEL = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

describe('MyUserModel', () => {
  it('should throw required error for undefined email', () => {
    expectErrorMessages(
      ERR_MYUSER_EMAIL_UNDEFINED,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for null email', () => {
    expectErrorMessages(
      ERR_MYUSER_EMAIL_NULL,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined username', () => {
    expectErrorMessages(
      ERR_MYUSER_USERNAME_UNDEFINED,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null username', () => {
    expectErrorMessages(
      ERR_MYUSER_USERNAME_NULL,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined customer', () => {
    expectErrorMessages(
      ERR_MYUSER_CUSTOMER_UNDEFINED,
      [ERR_MSG_CUSTOMER_REQUIRED],
      1
    )
  })

  it('should throw required error for null customer', () => {
    expectErrorMessages(
      ERR_MYUSER_CUSTOMER_NULL,
      [ERR_MSG_CUSTOMER_REQUIRED],
      1
    )
  })

  it('should accept valid MyUserModel', () => {
    expect(VALID_MYUSER_MODEL).not.toThrow()
  })
})
