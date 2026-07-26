import { PersonalDetailsModel } from '../../main/model/PersonalDetailsModel'
import { FirstnameModel } from '../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../main/model/customer/PhoneNumberModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { ERR_MSG_FIRSTNAME_REQUIRED } from '../../main/utils/customer/FirstnameUtils'
import { ERR_MSG_LASTNAME_REQUIRED } from '../../main/utils/customer/LastnameUtils'
import { ERR_MSG_PHONE_NUMBER_REQUIRED } from '../../main/utils/customer/PhoneNumberUtils'

// Valid dummy models to create PersonalDetailsModel
const VALID_FIRSTNAME_MODEL = new FirstnameModel('Anna')
const VALID_LASTNAME_MODEL = new LastnameModel('Kovács')
const VALID_PHONE_NUMBER_MODEL = new PhoneNumberModel('+36201234567')

// Invalid cases
const ERR_PERSONAL_DETAILS_FIRSTNAME_UNDEFINED = () => new PersonalDetailsModel(
  undefined as any,
  VALID_LASTNAME_MODEL,
  VALID_PHONE_NUMBER_MODEL
)
const ERR_PERSONAL_DETAILS_FIRSTNAME_NULL = () => new PersonalDetailsModel(
  null as any,
  VALID_LASTNAME_MODEL,
  VALID_PHONE_NUMBER_MODEL
)
const ERR_PERSONAL_DETAILS_LASTNAME_UNDEFINED = () => new PersonalDetailsModel(
  VALID_FIRSTNAME_MODEL,
  undefined as any,
  VALID_PHONE_NUMBER_MODEL
)
const ERR_PERSONAL_DETAILS_LASTNAME_NULL = () => new PersonalDetailsModel(
  VALID_FIRSTNAME_MODEL,
  null as any,
  VALID_PHONE_NUMBER_MODEL
)
const ERR_PERSONAL_DETAILS_PHONE_NUMBER_UNDEFINED = () => new PersonalDetailsModel(
  VALID_FIRSTNAME_MODEL,
  VALID_LASTNAME_MODEL,
  undefined as any
)
const ERR_PERSONAL_DETAILS_PHONE_NUMBER_NULL = () => new PersonalDetailsModel(
  VALID_FIRSTNAME_MODEL,
  VALID_LASTNAME_MODEL,
  null as any
)

// Valid case
const VALID_PERSONAL_DETAILS_MODEL = () => new PersonalDetailsModel(
  VALID_FIRSTNAME_MODEL,
  VALID_LASTNAME_MODEL,
  VALID_PHONE_NUMBER_MODEL
)

describe('PersonalDetailsModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined firstname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_FIRSTNAME_UNDEFINED,
      [ERR_MSG_FIRSTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null firstname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_FIRSTNAME_NULL,
      [ERR_MSG_FIRSTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined lastname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_LASTNAME_UNDEFINED,
      [ERR_MSG_LASTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null lastname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_LASTNAME_NULL,
      [ERR_MSG_LASTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined phone number', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_PHONE_NUMBER_UNDEFINED,
      [ERR_MSG_PHONE_NUMBER_REQUIRED],
      1
    )
  })

  it('should throw required error for null phone number', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_PHONE_NUMBER_NULL,
      [ERR_MSG_PHONE_NUMBER_REQUIRED],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid personal details', () => {
    expect(VALID_PERSONAL_DETAILS_MODEL).not.toThrow()
  })
})
