import { EmailModel } from '../../main/model/EmailModel'
import {
  EMAIL_VALUE_MAX_LENGTH,
  ERR_MSG_EMAIL_VALUE_REQUIRED,
  ERR_MSG_EMAIL_VALUE_FORMAT,
  ERR_MSG_EMAIL_VALUE_LENGTH
} from '../../main/utils/EmailUtils'
import { expectErrorMessages } from '../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_EMAIL_MODEL_UNDEFINED = () => new EmailModel(undefined as any)
const ERR_EMAIL_MODEL_NULL = () => new EmailModel(null as any)
const ERR_EMAIL_MODEL_EMPTY = () => new EmailModel('')
const ERR_EMAIL_MODEL_SPACE_ONLY = () => new EmailModel(' ')
const ERR_EMAIL_MODEL_TOO_LONG = () => new EmailModel('a'.repeat(EMAIL_VALUE_MAX_LENGTH - 9 + 1) + '@test.com')
const ERR_EMAIL_MODEL_INVALID_FORMAT_NO_AT_SYMBOL = () => new EmailModel('testexample.com')
const ERR_EMAIL_MODEL_INVALID_FORMAT_NO_LOCAL = () => new EmailModel('@example.com')
const ERR_EMAIL_MODEL_INVALID_FORMAT_NO_DOMAIN = () => new EmailModel('test@.com')
const ERR_EMAIL_MODEL_INVALID_FORMAT_NO_TLD = () => new EmailModel('test@example.')
const ERR_EMAIL_MODEL_LEADING_SPACES = () => new EmailModel(' test@example.com')
const ERR_EMAIL_MODEL_TRAILING_SPACES = () => new EmailModel('test@example.com ')
const ERR_EMAIL_MODEL_LEADING_TRAILING_SPACES = () => new EmailModel(' test@example.com ')

// Valid cases
const VALID_EMAIL_MODEL = () => new EmailModel('test@example.com')
const VALID_EMAIL_MODEL_MAX_LENGTH = () => new EmailModel('a'.repeat(EMAIL_VALUE_MAX_LENGTH - '@test.com'.length) + '@test.com')

describe('EmailModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_UNDEFINED,
      [ERR_MSG_EMAIL_VALUE_REQUIRED, ERR_MSG_EMAIL_VALUE_LENGTH, ERR_MSG_EMAIL_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_NULL,
      [ERR_MSG_EMAIL_VALUE_REQUIRED, ERR_MSG_EMAIL_VALUE_LENGTH, ERR_MSG_EMAIL_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_EMPTY,
      [ERR_MSG_EMAIL_VALUE_REQUIRED, ERR_MSG_EMAIL_VALUE_LENGTH, ERR_MSG_EMAIL_VALUE_FORMAT],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_SPACE_ONLY,
      [ERR_MSG_EMAIL_VALUE_REQUIRED, ERR_MSG_EMAIL_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_TOO_LONG,
      [ERR_MSG_EMAIL_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for missing "@" symbol', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_INVALID_FORMAT_NO_AT_SYMBOL,
      [ERR_MSG_EMAIL_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for missing local part', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_INVALID_FORMAT_NO_LOCAL,
      [ERR_MSG_EMAIL_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for missing domain', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_INVALID_FORMAT_NO_DOMAIN,
      [ERR_MSG_EMAIL_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for missing TLD', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_INVALID_FORMAT_NO_TLD,
      [ERR_MSG_EMAIL_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for leading spaces', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_LEADING_SPACES,
      [ERR_MSG_EMAIL_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for trailing spaces', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_TRAILING_SPACES,
      [ERR_MSG_EMAIL_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_EMAIL_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_EMAIL_VALUE_FORMAT],
      1
    )
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid email', () => {
    expect(VALID_EMAIL_MODEL).not.toThrow()
  })

  it('should accept valid max length email', () => {
    expect(VALID_EMAIL_MODEL_MAX_LENGTH).not.toThrow()
  })
})
