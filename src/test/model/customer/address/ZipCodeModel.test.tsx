import { ZipCodeModel } from '../../../../main/model/customer/address/ZipCodeModel'
import {
  ERR_MSG_ZIP_CODE_VALUE_REQUIRED,
  ERR_MSG_ZIP_CODE_VALUE_FORMAT,
  ERR_MSG_ZIP_CODE_VALUE_LENGTH
} from '../../../../main/utils/customer/address/ZipCodeUtils'
import { expectErrorMessages } from '../../../../main/utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_ZIP_MODEL_UNDEFINED = () => new ZipCodeModel(undefined as any)
const ERR_ZIP_MODEL_NULL = () => new ZipCodeModel(null as any)
const ERR_ZIP_MODEL_EMPTY = () => new ZipCodeModel('')
const ERR_ZIP_MODEL_SPACE_ONLY = () => new ZipCodeModel('    ')
const ERR_ZIP_MODEL_TOO_LONG = () => new ZipCodeModel('40322')
const ERR_ZIP_MODEL_TOO_SHORT = () => new ZipCodeModel('403')
const ERR_ZIP_MODEL_LEADING_SPACES = () => new ZipCodeModel(' 4032')
const ERR_ZIP_MODEL_TRAILING_SPACES = () => new ZipCodeModel('4032 ')
const ERR_ZIP_MODEL_LEADING_TRAILING_SPACES = () => new ZipCodeModel(' 4032 ')
const ERR_ZIP_MODEL_CONTAINS_SPACES = () => new ZipCodeModel('4 032')
const ERR_ZIP_MODEL_INVALID_SPECIAL_CHARACTER = () => new ZipCodeModel('403!')
const ERR_ZIP_MODEL_INVALID_LETTER = () => new ZipCodeModel('A403')

// Valid case
const VALID_ZIP_MODEL = () => new ZipCodeModel('4032')

describe('ZipCodeModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, length, and format errors for undefined', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_UNDEFINED,
      [ERR_MSG_ZIP_CODE_VALUE_REQUIRED, ERR_MSG_ZIP_CODE_VALUE_LENGTH, ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      3
    )
  })

  it('should throw required, length, and format errors for null', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_NULL,
      [ERR_MSG_ZIP_CODE_VALUE_REQUIRED, ERR_MSG_ZIP_CODE_VALUE_LENGTH, ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      3
    )
  })
  
  it('should throw required, length, and format errors for empty string', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_EMPTY,
      [ERR_MSG_ZIP_CODE_VALUE_REQUIRED, ERR_MSG_ZIP_CODE_VALUE_LENGTH, ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_SPACE_ONLY,
      [ERR_MSG_ZIP_CODE_VALUE_REQUIRED, ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      2
    )
  })

  it('should throw length and format errors for too long', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_TOO_LONG,
      [ERR_MSG_ZIP_CODE_VALUE_LENGTH, ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      2
    )
  })

  it('should throw length and format errors for too short', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_TOO_SHORT,
      [ERR_MSG_ZIP_CODE_VALUE_LENGTH, ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      2
    )
  })

  it('should throw format error for leading spaces', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_LEADING_SPACES,
      [ERR_MSG_ZIP_CODE_VALUE_FORMAT, ERR_MSG_ZIP_CODE_VALUE_LENGTH],
      2
    )
  })

  it('should throw format error for trailing spaces', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_TRAILING_SPACES,
      [ERR_MSG_ZIP_CODE_VALUE_FORMAT, ERR_MSG_ZIP_CODE_VALUE_LENGTH],
      2
    )
  })

  it('should throw format error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_ZIP_CODE_VALUE_FORMAT, ERR_MSG_ZIP_CODE_VALUE_LENGTH],
      2
    )
  })

  it('should throw format error for contains spaces', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_CONTAINS_SPACES,
      [ERR_MSG_ZIP_CODE_VALUE_FORMAT, ERR_MSG_ZIP_CODE_VALUE_LENGTH],
      2
    )
  })

  it('should throw format error for invalid special character', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_INVALID_SPECIAL_CHARACTER,
      [ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid letter', () => {
    expectErrorMessages(
      ERR_ZIP_MODEL_INVALID_LETTER,
      [ERR_MSG_ZIP_CODE_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new ZipCodeModel('4032')
    const b = new ZipCodeModel('4026')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new ZipCodeModel('4032')
    expect(a.equals(null as any)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new ZipCodeModel('4032')
    expect(a.equals(undefined as any)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid zip code', () => {
    expect(VALID_ZIP_MODEL).not.toThrow()
  })

  it('should return true for same value', () => {
    const a = new ZipCodeModel('4032')
    const b = new ZipCodeModel('4032')
    expect(a.equals(b)).toBe(true)
  })
})
