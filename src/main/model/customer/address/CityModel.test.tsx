import { CityModel } from './CityModel'
import {
  CITY_VALUE_MAX_LENGTH,
  CITY_VALUE_MIN_LENGTH,
  ERR_MSG_CITY_VALUE_REQUIRED,
  ERR_MSG_CITY_VALUE_LENGTH,
  ERR_MSG_CITY_VALUE_FORMAT
} from '../../../utils/customer/address/CityUtils'
import { expectErrorMessages } from '../../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_CITY_MODEL_UNDEFINED = () => new CityModel(undefined as any)
const ERR_CITY_MODEL_NULL = () => new CityModel(null as any)
const ERR_CITY_MODEL_EMPTY = () => new CityModel('')
const ERR_CITY_MODEL_SPACE_ONLY = () => new CityModel('  ')
const ERR_CITY_MODEL_TOO_LONG = () => new CityModel('a'.repeat(CITY_VALUE_MAX_LENGTH + 1))
const ERR_CITY_MODEL_TOO_SHORT = () => new CityModel('N')
const ERR_CITY_MODEL_LEADING_SPACE = () => new CityModel(' Debrecen')
const ERR_CITY_MODEL_TRAILING_SPACE = () => new CityModel('Debrecen ')
const ERR_CITY_MODEL_LEADING_TRAILING_SPACE = () => new CityModel(' Debrecen ')
const ERR_CITY_MODEL_INVALID_SPECIAL_CHARACTER = () => new CityModel('Bud@pest')
const ERR_CITY_MODEL_INVALID_LETTER = () => new CityModel('Bud@pest')

// Valid cases
const VALID_CITY_MODEL_ASCII_ONLY = () => new CityModel('Debrecen')
const VALID_CITY_MODEL_MIN_LENGTH = () => new CityModel('A'.repeat(CITY_VALUE_MIN_LENGTH))
const VALID_CITY_MODEL_MAX_LENGTH = () => new CityModel('A'.repeat(CITY_VALUE_MAX_LENGTH))
const VALID_CITY_MODEL_HUN_LETTERS = () => new CityModel('GyőrűűőŐÁÉ')

describe('CityModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_UNDEFINED,
      [ERR_MSG_CITY_VALUE_REQUIRED, ERR_MSG_CITY_VALUE_LENGTH, ERR_MSG_CITY_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(ERR_CITY_MODEL_NULL,
      [ERR_MSG_CITY_VALUE_REQUIRED, ERR_MSG_CITY_VALUE_LENGTH, ERR_MSG_CITY_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_EMPTY,
      [ERR_MSG_CITY_VALUE_REQUIRED, ERR_MSG_CITY_VALUE_LENGTH, ERR_MSG_CITY_VALUE_FORMAT],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(ERR_CITY_MODEL_SPACE_ONLY,
      [ERR_MSG_CITY_VALUE_REQUIRED, ERR_MSG_CITY_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_TOO_LONG,
      [ERR_MSG_CITY_VALUE_LENGTH],
      1
    )
  })

  it('should throw length error for too short', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_TOO_SHORT,
      [ERR_MSG_CITY_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for leading space', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_LEADING_SPACE,
      [ERR_MSG_CITY_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for trailing space', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_TRAILING_SPACE,
      [ERR_MSG_CITY_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for leading and trailing space', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_LEADING_TRAILING_SPACE,
      [ERR_MSG_CITY_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid special character', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_INVALID_SPECIAL_CHARACTER,
      [ERR_MSG_CITY_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid letter', () => {
    expectErrorMessages(
      ERR_CITY_MODEL_INVALID_LETTER,
      [ERR_MSG_CITY_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new CityModel('Budapest')
    const b = new CityModel('Debrecen')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new CityModel('Budapest')
    expect(a.equals(null as any)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new CityModel('Budapest')
    expect(a.equals(undefined as any)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid ASCII city', () => {
    expect(VALID_CITY_MODEL_ASCII_ONLY).not.toThrow()
  })

  it('should accept valid min length', () => {
    expect(VALID_CITY_MODEL_MIN_LENGTH).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_CITY_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid Hungarian letters', () => {
    expect(VALID_CITY_MODEL_HUN_LETTERS).not.toThrow()
  })

  it('should return true for same value (case-insensitive)', () => {
    const a = new CityModel('Budapest')
    const b = new CityModel('budapest')
    expect(a.equals(b)).toBe(true)
  })

  it('should return true for valid Hungarian letters with different cases', () => {
    const a = new CityModel('Győr')
    const b = new CityModel('győr')
    expect(a.equals(b)).toBe(true)
  })
})
