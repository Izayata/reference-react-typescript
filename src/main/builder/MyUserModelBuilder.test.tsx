import { MyUserModelBuilder } from './MyUserModelBuilder'
import { EmailModel } from '../model/EmailModel'
import { UsernameModel } from '../model/myUser/UsernameModel'
import { CustomerModelBuilder } from '../builder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../builder/PersonalDetailsModelBuilder'
import { FirstnameModel } from '../model/customer/FirstnameModel'
import { LastnameModel } from '../model/customer/LastnameModel'
import { PhoneNumberModel } from '../model/customer/PhoneNumberModel'
import { AddressModelBuilder } from '../builder/AddressModelBuilder'
import { ZipCodeModel } from '../model/customer/address/ZipCodeModel'
import { CityModel } from '../model/customer/address/CityModel'
import { StreetModel } from '../model/customer/address/StreetModel'
import { StreetNumberModel } from '../model/customer/address/StreetNumberModel'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { expectSetterReturnsSameInstance } from '../utils/test/ExpectSetterChaining'
import { ERR_MSG_EMAIL_REQUIRED } from '../utils/EmailUtils'
import { ERR_MSG_USERNAME_REQUIRED } from '../utils/myUser/UsernameUtils'
import { ERR_MSG_CUSTOMER_REQUIRED } from '../utils/MyUserModelUtils'

// Valid models for composing MyUserModel via the builder
const VALID_EMAIL_MODEL = new EmailModel('test@example.com')
const VALID_USERNAME_MODEL = new UsernameModel('testuser')
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
  .setEmail(VALID_EMAIL_MODEL)
  .setShippingAddress(VALID_ADDRESS_MODEL)
  .setBillingAddress(VALID_ADDRESS_MODEL)
  .build()

// Invalid cases
const ERR_MYUSER_MODEL_BUILDER_EMAIL_UNSET = () => new MyUserModelBuilder()
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_MODEL_BUILDER_EMAIL_NULL = () => new MyUserModelBuilder()
  .setEmail(null as any)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_MODEL_BUILDER_USERNAME_UNSET = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_MODEL_BUILDER_USERNAME_NULL = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(null as any)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

const ERR_MYUSER_MODEL_BUILDER_CUSTOMER_UNSET = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(VALID_USERNAME_MODEL)
  .build()

const ERR_MYUSER_MODEL_BUILDER_CUSTOMER_NULL = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(null as any)
  .build()

// Valid case
const VALID_MYUSER_MODEL_BUILDER = () => new MyUserModelBuilder()
  .setEmail(VALID_EMAIL_MODEL)
  .setMyUsername(VALID_USERNAME_MODEL)
  .setCustomer(VALID_CUSTOMER_MODEL)
  .build()

describe('MyUserModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error when email is never set', () => {
    expectErrorMessages(
      ERR_MYUSER_MODEL_BUILDER_EMAIL_UNSET,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error for null email', () => {
    expectErrorMessages(
      ERR_MYUSER_MODEL_BUILDER_EMAIL_NULL,
      [ERR_MSG_EMAIL_REQUIRED],
      1
    )
  })

  it('should throw required error when myUsername is never set', () => {
    expectErrorMessages(
      ERR_MYUSER_MODEL_BUILDER_USERNAME_UNSET,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null myUsername', () => {
    expectErrorMessages(
      ERR_MYUSER_MODEL_BUILDER_USERNAME_NULL,
      [ERR_MSG_USERNAME_REQUIRED],
      1
    )
  })

  it('should throw required error when customer is never set', () => {
    expectErrorMessages(
      ERR_MYUSER_MODEL_BUILDER_CUSTOMER_UNSET,
      [ERR_MSG_CUSTOMER_REQUIRED],
      1
    )
  })

  it('should throw required error for null customer', () => {
    expectErrorMessages(
      ERR_MYUSER_MODEL_BUILDER_CUSTOMER_NULL,
      [ERR_MSG_CUSTOMER_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept a valid MyUserModel', () => {
    expect(VALID_MYUSER_MODEL_BUILDER).not.toThrow()
  })

  it('setEmail returns the same builder instance for chaining', () => {
    const builder = new MyUserModelBuilder()
    expectSetterReturnsSameInstance(builder, b => b.setEmail(VALID_EMAIL_MODEL))
  })

  it('setEmail overwrites a previously set value', () => {
    const model = new MyUserModelBuilder()
      .setEmail(new EmailModel('other@example.com'))
      .setEmail(VALID_EMAIL_MODEL)
      .setMyUsername(VALID_USERNAME_MODEL)
      .setCustomer(VALID_CUSTOMER_MODEL)
      .build()
    expect(model.email.value).toBe(VALID_EMAIL_MODEL.value)
  })
})
