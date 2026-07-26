import { PhoneNumberModel } from '../../../main/model/customer/PhoneNumberModel'
import {
  ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED,
  ERR_MSG_PHONE_NUMBER_VALUE_INVALID,
  ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS
} from '../../../main/utils/customer/PhoneNumberUtils'
import { expectErrorMessages } from '../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_PHONE_MODEL_NUMBER_UNDEFINED = () => new PhoneNumberModel(undefined as any)
const ERR_PHONE_MODEL_NUMBER_NULL = () => new PhoneNumberModel(null as any)
const ERR_PHONE_MODEL_NUMBER_EMPTY = () => new PhoneNumberModel('')
const ERR_PHONE_MODEL_NUMBER_SPACE_ONLY = () => new PhoneNumberModel(' ')
const ERR_PHONE_MODEL_NUMBER_LEADING_SPACES = () => new PhoneNumberModel(' +36703129085')
const ERR_PHONE_MODEL_NUMBER_TRAILING_SPACES = () => new PhoneNumberModel('+36703129085 ')
const ERR_PHONE_MODEL_NUMBER_LEADING_TRAILING_SPACES = () => new PhoneNumberModel(' +36703129085 ')
const ERR_PHONE_MODEL_NUMBER_CONTAINS_SPACES = () => new PhoneNumberModel('+3670 3129085')
const ERR_PHONE_MODEL_NUMBER_INVALID_FORMAT = () => new PhoneNumberModel('+3670abc9085')

// Valid case
const VALID_PHONE_MODEL_INTERNATIONAL_FORMAT = () => new PhoneNumberModel('+36703129085')
const VALID_PHONE_MODEL_INTRA_FORMAT_HU = () => new PhoneNumberModel('06703129085')

describe('PhoneNumberModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required error for undefined', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_UNDEFINED,
      [ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED, ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required error for null', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_NULL,
      [ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED, ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      3
    )
  })
  
  it('should throw required error for empty string', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_EMPTY,
      [ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED, ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw required error for space-only string', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_SPACE_ONLY,
      [ERR_MSG_PHONE_NUMBER_VALUE_REQUIRED, ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      3
    )
  })

  it('should throw invalid error for leading spaces', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_LEADING_SPACES,
      [ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      2
    )
  })

  it('should throw invalid error for trailing spaces', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_TRAILING_SPACES,
      [ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw invalid error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_LEADING_TRAILING_SPACES,
      [ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      2
    )
  })

  it('should throw required error for contains spaces', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_CONTAINS_SPACES,
      [ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      1
    )
  })

  it('should throw invalid error for invalid format', () => {
    expectErrorMessages(
      ERR_PHONE_MODEL_NUMBER_INVALID_FORMAT,
      [ERR_MSG_PHONE_NUMBER_VALUE_INVALID, ERR_MSG_PHONE_NUMBER_VALUE_INVALID_CHARACTERS],
      2
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid phone number (international format)', () => {
    expect(VALID_PHONE_MODEL_INTERNATIONAL_FORMAT).not.toThrow()
  })

  it('should accept valid phone number intra format (HU)', () => {
    expect(VALID_PHONE_MODEL_INTRA_FORMAT_HU).not.toThrow()
  })
})
