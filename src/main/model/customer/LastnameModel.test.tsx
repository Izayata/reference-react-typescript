import { LastnameModel } from './LastnameModel'
import {
  LASTNAME_VALUE_MAX_LENGTH,
  ERR_MSG_LASTNAME_VALUE_REQUIRED,
  ERR_MSG_LASTNAME_VALUE_LENGTH,
  ERR_MSG_LASTNAME_VALUE_FORMAT
} from '../../utils/customer/LastnameUtils'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_LASTNAME_MODEL_UNDEFINED = () => new LastnameModel(undefined as any)
const ERR_LASTNAME_MODEL_NULL = () => new LastnameModel(null as any)
const ERR_LASTNAME_MODEL_EMPTY = () => new LastnameModel('')
const ERR_LASTNAME_MODEL_SPACE_ONLY = () => new LastnameModel('  ')
const ERR_LASTNAME_MODEL_TOO_LONG = () => new LastnameModel('A'.repeat(LASTNAME_VALUE_MAX_LENGTH + 1))
const ERR_LASTNAME_MODEL_TOO_SHORT = () => new LastnameModel('A')
const ERR_LASTNAME_MODEL_INVALID_DIGIT = () => new LastnameModel('Anna1')
const ERR_LASTNAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER = () => new LastnameModel('Anna!')
const ERR_LASTNAME_MODEL_LEADING_SPACES = () => new LastnameModel(' Anna')
const ERR_LASTNAME_MODEL_TRAILING_SPACES = () => new LastnameModel('Anna ')
const ERR_LASTNAME_MODEL_LEADING_TRAILING_SPACES = () => new LastnameModel(' Anna ')

// Valid cases
const VALID_LASTNAME_MODEL = () => new LastnameModel('Anna')
const VALID_LASTNAME_MODEL_MIN_LENGTH = () => new LastnameModel('An')
const VALID_LASTNAME_MODEL_MAX_LENGTH = () => new LastnameModel('A'.repeat(LASTNAME_VALUE_MAX_LENGTH))
const VALID_LASTNAME_MODEL_HUN_LETTERS = () => new LastnameModel('Ár-on Örs Éva')
const VALID_LASTNAME_MODEL_DASH_APOSTROPHE_DOT = () => new LastnameModel('Anna-Mari O\'Neil St. Joe')

describe('LastnameModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_UNDEFINED,
      [ERR_MSG_LASTNAME_VALUE_REQUIRED, ERR_MSG_LASTNAME_VALUE_LENGTH, ERR_MSG_LASTNAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_NULL,
      [ERR_MSG_LASTNAME_VALUE_REQUIRED, ERR_MSG_LASTNAME_VALUE_LENGTH, ERR_MSG_LASTNAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_EMPTY,
      [ERR_MSG_LASTNAME_VALUE_REQUIRED, ERR_MSG_LASTNAME_VALUE_LENGTH, ERR_MSG_LASTNAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_SPACE_ONLY,
      [ERR_MSG_LASTNAME_VALUE_REQUIRED, ERR_MSG_LASTNAME_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_TOO_LONG,
      [ERR_MSG_LASTNAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_TOO_SHORT,
      [ERR_MSG_LASTNAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for invalid digit', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_INVALID_DIGIT,
      [ERR_MSG_LASTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid banned special character', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_INVALID_BANNED_SPECIAL_CHARACTER,
      [ERR_MSG_LASTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for leading spaces', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_LEADING_SPACES,
      [ERR_MSG_LASTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for trailing spaces', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_TRAILING_SPACES,
      [ERR_MSG_LASTNAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_LASTNAME_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_LASTNAME_VALUE_FORMAT],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid firstname', () => {
    expect(VALID_LASTNAME_MODEL).not.toThrow()
  })

  it('should accept valid min length', () => {
    expect(VALID_LASTNAME_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_LASTNAME_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid Hungarian letters', () => {
    expect(VALID_LASTNAME_MODEL_HUN_LETTERS).not.toThrow()
  })

  it('should accept valid dash, apostrophe, and dot', () => {
    expect(VALID_LASTNAME_MODEL_DASH_APOSTROPHE_DOT).not.toThrow()
  })
})
