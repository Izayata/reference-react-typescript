import { RegistrationModel } from './RegistrationModel'
import { MyUserRegistrationModel } from './MyUserRegistrationModel'
import { PersonalDetailsModel } from './PersonalDetailsModel'
import { AddressModel } from './customer/AddressModel'
import { expectErrorMessages } from '../utils/test/ExpectErrorMessages'
import { ERR_MSG_PERSONAL_DETAILS_REQUIRED } from '../utils/PersonalDetailsUtils'
import { ERR_MSG_SHIPPING_ADDRESS_REQUIRED, ERR_MSG_BILLING_ADDRESS_REQUIRED } from '../utils/customer/AddressUtils'
import { ERR_MSG_MY_USER_REQUIRED } from '../utils/MyUserRegistrationUtils'

// Valid dummy models to create RegistrationModel
const VALID_MY_USER_MODEL = {} as MyUserRegistrationModel
const VALID_PERSONAL_DETAILS_MODEL = {} as PersonalDetailsModel
const VALID_ADDRESS_MODEL = {} as AddressModel

describe('RegistrationModel', () => {
  it('should throw required error for undefined myUser', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        undefined as any,
        VALID_PERSONAL_DETAILS_MODEL,
        VALID_ADDRESS_MODEL,
        VALID_ADDRESS_MODEL
      ),
      [ERR_MSG_MY_USER_REQUIRED],
      1
    )
  })

  it('should throw required error for null myUser', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        null as any,
        VALID_PERSONAL_DETAILS_MODEL,
        VALID_ADDRESS_MODEL,
        VALID_ADDRESS_MODEL
      ),
      [ERR_MSG_MY_USER_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined personalDetails', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        VALID_MY_USER_MODEL,
        undefined as any,
        VALID_ADDRESS_MODEL,
        VALID_ADDRESS_MODEL
      ),
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for null personalDetails', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        VALID_MY_USER_MODEL,
        null as any,
        VALID_ADDRESS_MODEL,
        VALID_ADDRESS_MODEL
      ),
      [ERR_MSG_PERSONAL_DETAILS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined shippingAddress', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        VALID_MY_USER_MODEL,
        VALID_PERSONAL_DETAILS_MODEL,
        undefined as any,
        VALID_ADDRESS_MODEL
      ),
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for null shippingAddress', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        VALID_MY_USER_MODEL,
        VALID_PERSONAL_DETAILS_MODEL,
        null as any,
        VALID_ADDRESS_MODEL
      ),
      [ERR_MSG_SHIPPING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined billingAddress', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        VALID_MY_USER_MODEL,
        VALID_PERSONAL_DETAILS_MODEL,
        VALID_ADDRESS_MODEL,
        undefined as any
      ),
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })

  it('should throw required error for null billingAddress', () => {
    expectErrorMessages(
      () => new RegistrationModel(
        VALID_MY_USER_MODEL,
        VALID_PERSONAL_DETAILS_MODEL,
        VALID_ADDRESS_MODEL,
        null as any
      ),
      [ERR_MSG_BILLING_ADDRESS_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid registration with all required fields', () => {
    expect(() => new RegistrationModel(
      VALID_MY_USER_MODEL,
      VALID_PERSONAL_DETAILS_MODEL,
      VALID_ADDRESS_MODEL,
      VALID_ADDRESS_MODEL
    )).not.toThrow()
  })
})
