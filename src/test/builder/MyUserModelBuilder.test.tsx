import { MyUserModelBuilder } from '../../main/builder/MyUserModelBuilder'
import { EmailModel } from '../../main/model/EmailModel'
import { UsernameModel } from '../../main/model/myUser/UsernameModel'
import { CustomerModelBuilder } from '../../main/builder/CustomerModelBuilder'
import { PersonalDetailsModelBuilder } from '../../main/builder/PersonalDetailsModelBuilder'
import { FirstnameModel } from '../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../main/model/customer/PhoneNumberModel'
import { AddressModelBuilder } from '../../main/builder/AddressModelBuilder'
import { ZipCodeModel } from '../../main/model/customer/address/ZipCodeModel'
import { CityModel } from '../../main/model/customer/address/CityModel'
import { StreetModel } from '../../main/model/customer/address/StreetModel'
import { StreetNumberModel } from '../../main/model/customer/address/StreetNumberModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { ERR_MSG_EMAIL_REQUIRED } from '../../main/utils/EmailUtils'
import { ERR_MSG_USERNAME_REQUIRED } from '../../main/utils/myUser/UsernameUtils'
import { ERR_MSG_CUSTOMER_REQUIRED } from '../../main/utils/MyUserModelUtils'

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
})
