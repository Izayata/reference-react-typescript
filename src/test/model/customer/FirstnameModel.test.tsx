import { FirstnameModel } from '../../../main/model/customer/FirstnameModel'
import {
  FIRSTNAME_VALUE_MAX_LENGTH,
  ERR_MSG_FIRSTNAME_VALUE_REQUIRED,
  ERR_MSG_FIRSTNAME_VALUE_LENGTH,
  ERR_MSG_FIRSTNAME_VALUE_FORMAT
} from '../../../main/utils/customer/FirstnameUtils'
import { expectErrorMessages } from '../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_FIRSTNAME_MODEL_UNDEFINED = () => new FirstnameModel(undefined as any)
const ERR_FIRSTNAME_MODEL_NULL = () => new FirstnameModel(null as any)
const ERR_FIRSTNAME_MODEL_EMPTY = () => new FirstnameModel('')
const ERR_FIRSTNAME_MODEL_SPACE_ONLY = () => new FirstnameModel('  ')
const ERR_FIRSTNAME_MODEL_TOO_LONG = () => new FirstnameModel('A'.repeat(FIRSTNAME_VALUE_MAX_LENGTH + 1))
const ERR_FIRSTNAME_MODEL_TOO_SHORT = () => new FirstnameModel('A')
const ERR_FIRSTNAME_MODEL_INVALID_DIGIT = () => new FirstnameModel('Anna1')
const ERR_FIRSTNAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER = () => new FirstnameModel('Anna!')
const ERR_FIRSTNAME_MODEL_LEADING_SPACES = () => new FirstnameModel(' Anna')
const ERR_FIRSTNAME_MODEL_TRAILING_SPACES = () => new FirstnameModel('Anna ')
const ERR_FIRSTNAME_MODEL_LEADING_TRAILING_SPACES = () => new FirstnameModel(' Anna ')

// Valid cases
const VALID_FIRSTNAME_MODEL = () => new FirstnameModel('Anna')
const VALID_FIRSTNAME_MODEL_MIN_LENGTH = () => new FirstnameModel('An')
const VALID_FIRSTNAME_MODEL_MAX_LENGTH = () => new FirstnameModel('A'.repeat(FIRSTNAME_VALUE_MAX_LENGTH))
const VALID_FIRSTNAME_MODEL_HUN_LETTERS = () => new FirstnameModel('Ár-on Örs Éva')
const VALID_FIRSTNAME_MODEL_DASH_APOSTROPHE_DOT = () => new FirstnameModel('Anna-Mari O\'Neil St. Joe')

describe('FirstnameModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_UNDEFINED,
      [ERR_MSG_FIRSTNAME_VALUE_REQUIRED, ERR_MSG_FIRSTNAME_VALUE_LENGTH, ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_NULL,
      [ERR_MSG_FIRSTNAME_VALUE_REQUIRED, ERR_MSG_FIRSTNAME_VALUE_LENGTH, ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      3
    )
  })
  
  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_EMPTY,
      [ERR_MSG_FIRSTNAME_VALUE_REQUIRED, ERR_MSG_FIRSTNAME_VALUE_LENGTH, ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_SPACE_ONLY,
      [ERR_MSG_FIRSTNAME_VALUE_REQUIRED, ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_TOO_LONG,
      [ERR_MSG_FIRSTNAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_TOO_SHORT,
      [ERR_MSG_FIRSTNAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for invalid digit', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_INVALID_DIGIT,
      [ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid banned special character', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER,
      [ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for leading spaces', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_LEADING_SPACES,
      [ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for trailing spaces', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_TRAILING_SPACES,
      [ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_FIRSTNAME_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_FIRSTNAME_VALUE_FORMAT],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid firstname', () => {
    expect(VALID_FIRSTNAME_MODEL).not.toThrow()
  })

  it('should accept valid min length', () => {
    expect(VALID_FIRSTNAME_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_FIRSTNAME_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid Hungarian letters', () => {
    expect(VALID_FIRSTNAME_MODEL_HUN_LETTERS).not.toThrow()
  })

  it('should accept valid dash, apostrophe, and dot', () => {
    expect(VALID_FIRSTNAME_MODEL_DASH_APOSTROPHE_DOT).not.toThrow()
  })
})
