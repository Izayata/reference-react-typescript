import { StreetNameModel } from './StreetNameModel'
import {
  STREET_NAME_VALUE_MAX_LENGTH,
  STREET_NAME_VALUE_MIN_LENGTH,
  ERR_MSG_STREET_NAME_VALUE_REQUIRED,
  ERR_MSG_STREET_NAME_VALUE_LENGTH,
  ERR_MSG_STREET_NAME_VALUE_FORMAT
} from '../../../utils/customer/address/StreetNameUtils'
import { expectErrorMessages } from '../../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_STREET_NAME_MODEL_UNDEFINED = () => new StreetNameModel(undefined as any)
const ERR_STREET_NAME_MODEL_NULL = () => new StreetNameModel(null as any)
const ERR_STREET_NAME_MODEL_EMPTY = () => new StreetNameModel('')
const ERR_STREET_NAME_MODEL_SPACE_ONLY = () => new StreetNameModel('  ')
const ERR_STREET_NAME_MODEL_TOO_LONG = () => new StreetNameModel('a'.repeat(STREET_NAME_VALUE_MAX_LENGTH + 1))
const ERR_STREET_NAME_MODEL_TOO_SHORT = () => new StreetNameModel('A')
const ERR_STREET_NAME_MODEL_LEADING_SPACES = () => new StreetNameModel(' Kossuth Lajos')
const ERR_STREET_NAME_MODEL_TRAILING_SPACES = () => new StreetNameModel('Kossuth Lajos ')
const ERR_STREET_NAME_MODEL_LEADING_TRAILING_SPACES = () => new StreetNameModel(' Kossuth Lajos ')
const ERR_STREET_NAME_MODEL_INVALID_CHARACTER = () => new StreetNameModel('@mbrózi@')
const VALID_STREET_NAME_MODEL = () => new StreetNameModel('Kossuth Lajos')

// Valid cases
const VALID_STREET_NAME_MODEL_MIN_LENGTH = () => new StreetNameModel('A'.repeat(STREET_NAME_VALUE_MIN_LENGTH))
const VALID_STREET_NAME_MODEL_MAX_LENGTH = () => new StreetNameModel('A'.repeat(STREET_NAME_VALUE_MAX_LENGTH))

describe('StreetNameModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_UNDEFINED,
      [ERR_MSG_STREET_NAME_VALUE_REQUIRED, ERR_MSG_STREET_NAME_VALUE_LENGTH, ERR_MSG_STREET_NAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_NULL,
      [ERR_MSG_STREET_NAME_VALUE_REQUIRED, ERR_MSG_STREET_NAME_VALUE_LENGTH, ERR_MSG_STREET_NAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_EMPTY,
      [ERR_MSG_STREET_NAME_VALUE_REQUIRED, ERR_MSG_STREET_NAME_VALUE_LENGTH, ERR_MSG_STREET_NAME_VALUE_FORMAT],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_SPACE_ONLY,
      [ERR_MSG_STREET_NAME_VALUE_REQUIRED, ERR_MSG_STREET_NAME_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_TOO_LONG,
      [ERR_MSG_STREET_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_TOO_SHORT,
      [ERR_MSG_STREET_NAME_VALUE_LENGTH],
      1
    )
  })

  it('should throw leading/trailing space error for leading spaces', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_LEADING_SPACES,
      [ERR_MSG_STREET_NAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for trailing spaces', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_TRAILING_SPACES,
      [ERR_MSG_STREET_NAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw leading/trailing space error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_STREET_NAME_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid character', () => {
    expectErrorMessages(
      ERR_STREET_NAME_MODEL_INVALID_CHARACTER,
      [ERR_MSG_STREET_NAME_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new StreetNameModel('Kossuth Lajos')
    const b = new StreetNameModel('Petőfi Sándor')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new StreetNameModel('Kossuth Lajos')
    expect(a.equals(null as any)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new StreetNameModel('Kossuth Lajos')
    expect(a.equals(undefined as any)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid street name', () => {
    expect(VALID_STREET_NAME_MODEL).not.toThrow()
  })

  it('should accept valid min length', () => {
    expect(VALID_STREET_NAME_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_STREET_NAME_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should return true for same value (case-insensitive)', () => {
    const a = new StreetNameModel('Kossuth Lajos')
    const b = new StreetNameModel('kossuth lajos')
    expect(a.equals(b)).toBe(true)
  })

  it('should return true for valid Hungarian letters with different cases', () => {
    const a = new StreetNameModel('Árvíztűrő')
    const b = new StreetNameModel('árvíztűrő')
    expect(a.equals(b)).toBe(true)
  })
})
