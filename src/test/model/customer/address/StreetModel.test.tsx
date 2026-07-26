import { StreetModel } from '../../../../main/model/customer/address/StreetModel'
import {
  STREET_VALUE_MAX_LENGTH,
  STREET_VALUE_MIN_LENGTH,
  ERR_MSG_STREET_VALUE_REQUIRED,
  ERR_MSG_STREET_VALUE_LENGTH,
  ERR_MSG_STREET_VALUE_FORMAT
} from '../../../../main/utils/customer/address/StreetUtils'
import { expectErrorMessages } from '../../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_STREET_MODEL_UNDEFINED = () => new StreetModel(undefined as any)
const ERR_STREET_MODEL_NULL = () => new StreetModel(null as any)
const ERR_STREET_MODEL_EMPTY = () => new StreetModel('')
const ERR_STREET_MODEL_SPACE_ONLY = () => new StreetModel('  ')
const ERR_STREET_MODEL_TOO_LONG = () => new StreetModel('a'.repeat(STREET_VALUE_MAX_LENGTH + 1))
const ERR_STREET_MODEL_TOO_SHORT = () => new StreetModel('A')
const ERR_STREET_MODEL_LEADING_SPACES = () => new StreetModel(' Kossuth Lajos utca')
const ERR_STREET_MODEL_TRAILING_SPACES = () => new StreetModel('Kossuth Lajos utca ')
const ERR_STREET_MODEL_LEADING_TRAILING_SPACES = () => new StreetModel(' Kossuth Lajos utca ')
const ERR_STREET_MODEL_INVALID_CHARACTER = () => new StreetModel('@mbrózi@ utc@')
const VALID_STREET_MODEL = () => new StreetModel('Kossuth Lajos utca')

// Valid cases
const VALID_STREET_MODEL_MIN_LENGTH = () => new StreetModel('A'.repeat(STREET_VALUE_MIN_LENGTH))
const VALID_STREET_MODEL_MAX_LENGTH = () => new StreetModel('A'.repeat(STREET_VALUE_MAX_LENGTH))

describe('StreetModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefied', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_UNDEFINED,
      [ERR_MSG_STREET_VALUE_REQUIRED, ERR_MSG_STREET_VALUE_LENGTH, ERR_MSG_STREET_VALUE_FORMAT],
      3
    )
  })
  
  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_NULL,
      [ERR_MSG_STREET_VALUE_REQUIRED, ERR_MSG_STREET_VALUE_LENGTH, ERR_MSG_STREET_VALUE_FORMAT],
      3
    )
  })
  
  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_EMPTY,
      [ERR_MSG_STREET_VALUE_REQUIRED, ERR_MSG_STREET_VALUE_LENGTH, ERR_MSG_STREET_VALUE_FORMAT],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_SPACE_ONLY,
      [ERR_MSG_STREET_VALUE_REQUIRED, ERR_MSG_STREET_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_TOO_LONG,
      [ERR_MSG_STREET_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_TOO_SHORT,
      [ERR_MSG_STREET_VALUE_LENGTH],
      1
    )
  })

  it('should throw leading/trailing space error for leading spaces', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_LEADING_SPACES,
      [ERR_MSG_STREET_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for trailing spaces', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_TRAILING_SPACES,
      [ERR_MSG_STREET_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_STREET_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid character', () => {
    expectErrorMessages(
      ERR_STREET_MODEL_INVALID_CHARACTER,
      [ERR_MSG_STREET_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new StreetModel('Kossuth Lajos utca')
    const b = new StreetModel('Petőfi Sándor utca')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new StreetModel('Kossuth Lajos utca')
    expect(a.equals(null as any)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new StreetModel('Kossuth Lajos utca')
    expect(a.equals(undefined as any)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid street', () => {
    expect(VALID_STREET_MODEL).not.toThrow()
  })

  it('should accept valid min length', () => {
    expect(VALID_STREET_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_STREET_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should return true for same value (case-insensitive)', () => {
    const a = new StreetModel('Kossuth Lajos utca')
    const b = new StreetModel('kossuth lajos utca')
    expect(a.equals(b)).toBe(true)
  })

  it('should return true for valid Hungarian letters with different cases', () => {
    const a = new StreetModel('Árvíztűrő utca')
    const b = new StreetModel('árvíztűrő utca')
    expect(a.equals(b)).toBe(true)
  })
})
