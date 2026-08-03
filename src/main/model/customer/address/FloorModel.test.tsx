import { FloorModel } from './FloorModel'
import {
  FLOOR_VALUE_MAX_LENGTH,
  ERR_MSG_FLOOR_VALUE_REQUIRED,
  ERR_MSG_FLOOR_VALUE_FORMAT,
  ERR_MSG_FLOOR_VALUE_LENGTH
} from '../../../utils/customer/address/FloorUtils'
import { expectErrorMessages } from '../../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_FLOOR_MODEL_UNDEFINED = () => new FloorModel(undefined as any)
const ERR_FLOOR_MODEL_NULL = () => new FloorModel(null as any)
const ERR_FLOOR_MODEL_EMPTY = () => new FloorModel('')
const ERR_FLOOR_MODEL_SPACE_ONLY = () => new FloorModel(' ')
const ERR_FLOOR_MODEL_TOO_LONG = () => new FloorModel('A'.repeat(FLOOR_VALUE_MAX_LENGTH + 1))
const ERR_FLOOR_MODEL_CONTAINS_SPACES = () => new FloorModel('2 1')
const ERR_FLOOR_MODEL_CONTAINS_SLASH = () => new FloorModel('2/1')

// Valid cases
const VALID_FLOOR_MODEL_NUMBER = () => new FloorModel('2')
const VALID_FLOOR_MODEL_LETTERS = () => new FloorModel('fsz')
const VALID_FLOOR_MODEL_DASH_NUMBER = () => new FloorModel('-1')
const VALID_FLOOR_MODEL_HUN_LETTER = () => new FloorModel('á')
const VALID_FLOOR_MODEL_MAX_LENGTH = () => new FloorModel('A'.repeat(FLOOR_VALUE_MAX_LENGTH))

describe('FloorModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, format, and length errors for undefined', () => {
    expectErrorMessages(
      ERR_FLOOR_MODEL_UNDEFINED,
      [ERR_MSG_FLOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_VALUE_FORMAT, ERR_MSG_FLOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required, format, and length errors for null', () => {
    expectErrorMessages(
      ERR_FLOOR_MODEL_NULL,
      [ERR_MSG_FLOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_VALUE_FORMAT, ERR_MSG_FLOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required, format, and length errors for empty string', () => {
    expectErrorMessages(
      ERR_FLOOR_MODEL_EMPTY,
      [ERR_MSG_FLOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_VALUE_FORMAT, ERR_MSG_FLOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_FLOOR_MODEL_SPACE_ONLY,
      [ERR_MSG_FLOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_FLOOR_MODEL_TOO_LONG,
      [ERR_MSG_FLOOR_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for contains spaces', () => {
    expectErrorMessages(
      ERR_FLOOR_MODEL_CONTAINS_SPACES,
      [ERR_MSG_FLOOR_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for contains slash', () => {
    expectErrorMessages(
      ERR_FLOOR_MODEL_CONTAINS_SLASH,
      [ERR_MSG_FLOOR_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new FloorModel('2')
    const b = new FloorModel('3')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new FloorModel('2')
    expect(a.equals(null)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new FloorModel('2')
    expect(a.equals(undefined)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid number', () => {
    expect(VALID_FLOOR_MODEL_NUMBER).not.toThrow()
  })

  it('should accept valid letters', () => {
    expect(VALID_FLOOR_MODEL_LETTERS).not.toThrow()
  })

  it('should accept valid dash-number', () => {
    expect(VALID_FLOOR_MODEL_DASH_NUMBER).not.toThrow()
  })

  it('should accept valid Hungarian letter', () => {
    expect(VALID_FLOOR_MODEL_HUN_LETTER).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_FLOOR_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should return true for same value (case-insensitive)', () => {
    const a = new FloorModel('fsz')
    const b = new FloorModel('FSZ')
    expect(a.equals(b)).toBe(true)
  })
})
