import { PasswordModel } from './PasswordModel'
import {
  PASSWORD_VALUE_MAX_LENGTH,
  ERR_MSG_PASSWORD_VALUE_REQUIRED,
  ERR_MSG_PASSWORD_VALUE_FORMAT,
  ERR_MSG_PASSWORD_VALUE_LENGTH,
} from '../../utils/myUser/PasswordUtils'
import { expectErrorMessages } from '../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_PASSWORD_MODEL_UNDEFINED = () => new PasswordModel(undefined as any)
const ERR_PASSWORD_MODEL_NULL = () => new PasswordModel(null as any)
const ERR_PASSWORD_MODEL_EMPTY = () => new PasswordModel('')
const ERR_PASSWORD_MODEL_SPACE_ONLY = () => new PasswordModel('        ')
const ERR_PASSWORD_MODEL_TOO_LONG = () => new PasswordModel('A'.repeat(PASSWORD_VALUE_MAX_LENGTH + 1 - 3) + 'b1!')
const ERR_PASSWORD_MODEL_TOO_SHORT = () => new PasswordModel('Ab1!')
const ERR_PASSWORD_MODEL_LEADING_SPACES = () => new PasswordModel(' ValidPass123!')
const ERR_PASSWORD_MODEL_TRAILING_SPACES = () => new PasswordModel('ValidPass123! ')
const ERR_PASSWORD_MODEL_LEADING_TRAILING_SPACES = () => new PasswordModel(' ValidPass123! ')
const ERR_PASSWORD_MODEL_CONTAINS_SPACE = () => new PasswordModel('Valid Pass123!')
const ERR_PASSWORD_MODEL_NO_LOWERCASE_LETTER = () => new PasswordModel('VALIDPASS123!')
const ERR_PASSWORD_MODEL_NO_UPPERCASE_LETTER = () => new PasswordModel('validpass123!')
const ERR_PASSWORD_MODEL_NO_DIGIT = () => new PasswordModel('ValidPass!')
const ERR_PASSWORD_MODEL_NO_SPECIAL_CHARACTER = () => new PasswordModel('ValidPass123')

// Valid cases
const VALID_PASSWORD_MODEL = () => new PasswordModel('ValidPass123!')
const VALID_PASSWORD_MODEL_MIN_LENGTH = () => new PasswordModel('Abc1234!')
const VALID_PASSWORD_MODEL_MAX_LENGTH = () => new PasswordModel('A'.repeat(PASSWORD_VALUE_MAX_LENGTH - 5) + 'b123!')

describe('PasswordModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_UNDEFINED,
      [ERR_MSG_PASSWORD_VALUE_REQUIRED, ERR_MSG_PASSWORD_VALUE_LENGTH, ERR_MSG_PASSWORD_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_NULL,
      [ERR_MSG_PASSWORD_VALUE_REQUIRED, ERR_MSG_PASSWORD_VALUE_LENGTH, ERR_MSG_PASSWORD_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_EMPTY,
      [ERR_MSG_PASSWORD_VALUE_REQUIRED, ERR_MSG_PASSWORD_VALUE_LENGTH, ERR_MSG_PASSWORD_VALUE_FORMAT],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_SPACE_ONLY,
      [ERR_MSG_PASSWORD_VALUE_REQUIRED, ERR_MSG_PASSWORD_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_TOO_LONG,
      [ERR_MSG_PASSWORD_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_TOO_SHORT,
      [ERR_MSG_PASSWORD_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for leading spaces', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_LEADING_SPACES,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for trailing spaces', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_TRAILING_SPACES,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for contains space', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_CONTAINS_SPACE,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for no lowercase letter', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_NO_LOWERCASE_LETTER,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for no uppercase letter', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_NO_UPPERCASE_LETTER,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for no digit', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_NO_DIGIT,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for no special character', () => {
    expectErrorMessages(
      ERR_PASSWORD_MODEL_NO_SPECIAL_CHARACTER,
      [ERR_MSG_PASSWORD_VALUE_FORMAT],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid password', () => {
    expect(VALID_PASSWORD_MODEL).not.toThrow()
  })

  it('should accept valid min length password', () => {
    expect(VALID_PASSWORD_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid max length password', () => {
    expect(VALID_PASSWORD_MODEL_MAX_LENGTH).not.toThrow()
  })
})
