import { PersonalDetailsModelBuilder } from '../../main/builder/PersonalDetailsModelBuilder'
import { FirstnameModel } from '../../main/model/customer/FirstnameModel'
import { LastnameModel } from '../../main/model/customer/LastnameModel'
import { PhoneNumberModel } from '../../main/model/customer/PhoneNumberModel'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'
import { ERR_MSG_FIRSTNAME_REQUIRED } from '../../main/utils/customer/FirstnameUtils'
import { ERR_MSG_LASTNAME_REQUIRED } from '../../main/utils/customer/LastnameUtils'
import { ERR_MSG_PHONE_NUMBER_REQUIRED } from '../../main/utils/customer/PhoneNumberUtils'

// Valid models for composing PersonalDetailsModel
const VALID_FIRSTNAME_MODEL = new FirstnameModel('János')
const VALID_LASTNAME_MODEL = new LastnameModel('Kovács')
const VALID_PHONE_NUMBER_MODEL = new PhoneNumberModel('+36201234567')

// Invalid cases
const ERR_PERSONAL_DETAILS_MODEL_BUILDER_FIRSTNAME_UNDEFINED = () => new PersonalDetailsModelBuilder()
  .setLastname(VALID_LASTNAME_MODEL)
  .setPhoneNumber(VALID_PHONE_NUMBER_MODEL)
  .build()

const ERR_PERSONAL_DETAILS_MODEL_BUILDER_FIRSTNAME_NULL = () => new PersonalDetailsModelBuilder()
  .setFirstname(null as any)
  .setLastname(VALID_LASTNAME_MODEL)
  .setPhoneNumber(VALID_PHONE_NUMBER_MODEL)
  .build()

const ERR_PERSONAL_DETAILS_MODEL_BUILDER_LASTNAME_UNDEFINED = () => new PersonalDetailsModelBuilder()
  .setFirstname(VALID_FIRSTNAME_MODEL)
  .setPhoneNumber(VALID_PHONE_NUMBER_MODEL)
  .build()

const ERR_PERSONAL_DETAILS_MODEL_BUILDER_LASTNAME_NULL = () => new PersonalDetailsModelBuilder()
  .setFirstname(VALID_FIRSTNAME_MODEL)
  .setLastname(null as any)
  .setPhoneNumber(VALID_PHONE_NUMBER_MODEL)
  .build()

const ERR_PERSONAL_DETAILS_MODEL_BUILDER_PHONE_NUMBER_UNDEFINED = () => new PersonalDetailsModelBuilder()
  .setFirstname(VALID_FIRSTNAME_MODEL)
  .setLastname(VALID_LASTNAME_MODEL)
  .build()

const ERR_PERSONAL_DETAILS_MODEL_BUILDER_PHONE_NUMBER_NULL = () => new PersonalDetailsModelBuilder()
  .setFirstname(VALID_FIRSTNAME_MODEL)
  .setLastname(VALID_LASTNAME_MODEL)
  .setPhoneNumber(null as any)
  .build()

// Valid case
const VALID_PERSONAL_DETAILS_MODEL_BUILDER = () => new PersonalDetailsModelBuilder()
  .setFirstname(VALID_FIRSTNAME_MODEL)
  .setLastname(VALID_LASTNAME_MODEL)
  .setPhoneNumber(VALID_PHONE_NUMBER_MODEL)
  .build()

describe('PersonalDetailsModelBuilder', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined firstname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_MODEL_BUILDER_FIRSTNAME_UNDEFINED,
      [ERR_MSG_FIRSTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null firstname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_MODEL_BUILDER_FIRSTNAME_NULL,
      [ERR_MSG_FIRSTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined lastname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_MODEL_BUILDER_LASTNAME_UNDEFINED,
      [ERR_MSG_LASTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for null lastname', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_MODEL_BUILDER_LASTNAME_NULL,
      [ERR_MSG_LASTNAME_REQUIRED],
      1
    )
  })

  it('should throw required error for undefined phoneNumber', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_MODEL_BUILDER_PHONE_NUMBER_UNDEFINED,
      [ERR_MSG_PHONE_NUMBER_REQUIRED],
      1
    )
  })

  it('should throw required error for null phoneNumber', () => {
    expectErrorMessages(
      ERR_PERSONAL_DETAILS_MODEL_BUILDER_PHONE_NUMBER_NULL,
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
    expect(VALID_PERSONAL_DETAILS_MODEL_BUILDER).not.toThrow()
  })
})
