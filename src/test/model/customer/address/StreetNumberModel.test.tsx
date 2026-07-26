import { StreetNumberModel } from '../../../../main/model/customer/address/StreetNumberModel'
import {
  STREET_NUMBER_VALUE_MAX_LENGTH,
  ERR_MSG_STREET_NUMBER_VALUE_REQUIRED,
  ERR_MSG_STREET_NUMBER_VALUE_LENGTH,
  ERR_MSG_STREET_NUMBER_VALUE_FORMAT,
  ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN
} from '../../../../main/utils/customer/address/StreetNumberUtils'
import { expectErrorMessages } from '../../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_STREET_NUMBER_MODEL_UNDEFINED = () => new StreetNumberModel(undefined as any)
const ERR_STREET_NUMBER_MODEL_NULL = () => new StreetNumberModel(null as any)
const ERR_STREET_NUMBER_MODEL_EMPTY = () => new StreetNumberModel('')
const ERR_STREET_NUMBER_MODEL_SPACE_ONLY = () => new StreetNumberModel(' ')
const ERR_STREET_NUMBER_MODEL_ZERO = () => new StreetNumberModel('0')
const ERR_STREET_NUMBER_MODEL_ZERO_SLASH_ZERO = () => new StreetNumberModel('0/0')
const ERR_STREET_NUMBER_MODEL_ZERO_SLASH_ONE = () => new StreetNumberModel('0/1')
const ERR_STREET_NUMBER_MODEL_ZERO_SLASH_UPPERCASE_A = () => new StreetNumberModel('0/A')
const ERR_STREET_NUMBER_MODEL_ZERO_SLASH_LOWERCASE_A = () => new StreetNumberModel('0/a')
const ERR_STREET_NUMBER_MODEL_TOO_LONG = () => new StreetNumberModel('1'.repeat(STREET_NUMBER_VALUE_MAX_LENGTH + 1))
const ERR_STREET_NUMBER_MODEL_LEADING_SPACES = () => new StreetNumberModel(' 21/A')
const ERR_STREET_NUMBER_MODEL_TRAILING_SPACES = () => new StreetNumberModel('21/A ')
const ERR_STREET_NUMBER_MODEL_LEADING_TRAILING_SPACES = () => new StreetNumberModel(' 21/A ')
const ERR_STREET_NUMBER_MODEL_CONTAINS_SPACES = () => new StreetNumberModel('2 1/A')
const ERR_STREET_NUMBER_MODEL_INVALID_FORMAT = () => new StreetNumberModel('21@A')
const ERR_STREET_NUMBER_MODEL_INVALID_CHARACTER = () => new StreetNumberModel('1/a@')

// Valid cases
const VALID_STREET_NUMBER_MODEL = () => new StreetNumberModel('12')
const VALID_STREET_NUMBER_MODEL_SLASH_UPPERCASE_LETTER = () => new StreetNumberModel('21/A')
const VALID_STREET_NUMBER_MODEL_SLASH_LOWERCASE_LETTER = () => new StreetNumberModel('21/a')
const VALID_STREET_NUMBER_MODEL_UPPERCASE_LETTER = () => new StreetNumberModel('21A')
const VALID_STREET_NUMBER_MODEL_LOWERCASE_LETTER = () => new StreetNumberModel('21a')
const VALID_STREET_NUMBER_MODEL_SLASH_NUMBER = () => new StreetNumberModel('2/2')
const VALID_STREET_NUMBER_MODEL_MAX_LENGTH = () => new StreetNumberModel('1'.repeat(STREET_NUMBER_VALUE_MAX_LENGTH))
const VALID_STREET_NUMBER_MODEL_MIN_LENGTH = () => new StreetNumberModel('1')

describe('StreetNumberModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_UNDEFINED,
      [ERR_MSG_STREET_NUMBER_VALUE_REQUIRED, ERR_MSG_STREET_NUMBER_VALUE_LENGTH, ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_NULL,
      [ERR_MSG_STREET_NUMBER_VALUE_REQUIRED, ERR_MSG_STREET_NUMBER_VALUE_LENGTH, ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      3
    )
  })
  
  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_EMPTY,
      [ERR_MSG_STREET_NUMBER_VALUE_REQUIRED, ERR_MSG_STREET_NUMBER_VALUE_LENGTH, ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_SPACE_ONLY,
      [ERR_MSG_STREET_NUMBER_VALUE_REQUIRED, ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      2
    )
  })

  it('should throw forbidden error for "0"', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_ZERO,
      [ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN],
      1
    )
  })

  it('should throw forbidden error for "0/0"', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_ZERO_SLASH_ZERO,
      [ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN],
      1
    )
  })

  it('should throw forbidden error for "0/1"', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_ZERO_SLASH_ONE,
      [ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN],
      1
    )
  })

  it('should throw forbidden error for "0/A"', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_ZERO_SLASH_UPPERCASE_A,
      [ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN],
      1
    )
  })

  it('should throw forbidden error for "0/a"', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_ZERO_SLASH_LOWERCASE_A,
      [ERR_MSG_STREET_NUMBER_VALUE_FORBIDDEN],
      1
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_TOO_LONG,
      [ERR_MSG_STREET_NUMBER_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for leading spaces', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_LEADING_SPACES,
      [ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for trailing spaces', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_TRAILING_SPACES,
      [ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      1
    )
  })

  it('should throw contains space error for contains spaces', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_CONTAINS_SPACES,
      [ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid format', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_INVALID_FORMAT,
      [ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid character', () => {
    expectErrorMessages(
      ERR_STREET_NUMBER_MODEL_INVALID_CHARACTER,
      [ERR_MSG_STREET_NUMBER_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new StreetNumberModel('21/A')
    const b = new StreetNumberModel('22/B')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new StreetNumberModel('21/A')
    expect(a.equals(null as any)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new StreetNumberModel('21/A')
    expect(a.equals(undefined as any)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid street number', () => {
    expect(VALID_STREET_NUMBER_MODEL).not.toThrow()
  })

  it('should accept valid slash uppercase letter', () => {
    expect(VALID_STREET_NUMBER_MODEL_SLASH_UPPERCASE_LETTER).not.toThrow()
  })

  it('should accept valid slash lowercase letter', () => {
    expect(VALID_STREET_NUMBER_MODEL_SLASH_LOWERCASE_LETTER).not.toThrow()
  })

  it('should accept valid uppercase letter', () => {
    expect(VALID_STREET_NUMBER_MODEL_UPPERCASE_LETTER).not.toThrow()
  })

  it('should accept valid lowercase letter', () => {
    expect(VALID_STREET_NUMBER_MODEL_LOWERCASE_LETTER).not.toThrow()
  })

  it('should accept valid slash number', () => {
    expect(VALID_STREET_NUMBER_MODEL_SLASH_NUMBER).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_STREET_NUMBER_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid min length', () => {
    expect(VALID_STREET_NUMBER_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should return true for same value (case-insensitive)', () => {
    const a = new StreetNumberModel('21/A')
    const b = new StreetNumberModel('21/a')
    expect(a.equals(b)).toBe(true)
  })
})
