import { FloorDoorModel } from './FloorDoorModel'
import {
  FLOOR_DOOR_VALUE_MAX_LENGTH,
  ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED,
  ERR_MSG_FLOOR_DOOR_VALUE_FORMAT,
  ERR_MSG_FLOOR_DOOR_VALUE_LENGTH
} from '../../../utils/customer/address/FloorDoorUtils'
import { expectErrorMessages } from '../../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_FLOOR_DOOR_MODEL_UNDEFINED = () => new FloorDoorModel(undefined as any)
const ERR_FLOOR_DOOR_MODEL_NULL = () => new FloorDoorModel(null as any)
const ERR_FLOOR_DOOR_MODEL_EMPTY = () => new FloorDoorModel('')
const ERR_FLOOR_DOOR_MODEL_SPACE_ONLY = () => new FloorDoorModel(' ')
const ERR_FLOOR_DOOR_MODEL_TOO_LONG = () => new FloorDoorModel('A'.repeat(FLOOR_DOOR_VALUE_MAX_LENGTH + 1))
const ERR_FLOOR_DOOR_MODEL_LEADING_SPACES = () => new FloorDoorModel(' 21/A')
const ERR_FLOOR_DOOR_MODEL_TRAILING_SPACES = () => new FloorDoorModel('21/A ')
const ERR_FLOOR_DOOR_MODEL_LEADING_TRAILING_SPACES = () => new FloorDoorModel(' 21/A ')
const ERR_FLOOR_DOOR_MODEL_CONTAINS_SPACES = () => new FloorDoorModel('2 1/A')
const ERR_FLOOR_DOOR_MODEL_INVALID_FORMAT = () => new FloorDoorModel('2//B')

// Valid cases
const VALID_FLOOR_DOOR_MODEL_NUMBER_SLASH_NUMBER = () => new FloorDoorModel('2/8')
const VALID_FLOOR_DOOR_MODEL_LETTER_SLASH_LETTER = () => new FloorDoorModel('A/B')
const VALID_FLOOR_DOOR_MODEL_LETTER_SLASH_NUMBER = () => new FloorDoorModel('A/1')
const VALID_FLOOR_DOOR_MODEL_NUMBER_SLASH_LETTER = () => new FloorDoorModel('1/B')
const VALID_FLOOR_DOOR_MODEL_NUMBER_NUMBER_HUN_LETTER_SLASH_HUN_LETTER = () => new FloorDoorModel('21Á/ű')
const VALID_FLOOR_DOOR_MODEL_DASH_NUMBER_SLASH_LETTER = () => new FloorDoorModel('-1/B')
const VALID_FLOOR_DOOR_MODEL_NUMBER_LETTER = () => new FloorDoorModel('1B')
const VALID_FLOOR_DOOR_MODEL_DASH_NUMBER_LETTER = () => new FloorDoorModel('-1a')
const VALID_FLOOR_DOOR_MODEL_NUMBER_FLOOR_ONLY = () => new FloorDoorModel('11')
const VALID_FLOOR_DOOR_MODEL_MIN_LENGTH_NUMBER_ONLY = () => new FloorDoorModel('2')
const VALID_FLOOR_DOOR_MODEL_MIN_LENGTH_LETTER_ONLY = () => new FloorDoorModel('A')
const VALID_FLOOR_DOOR_MODEL_MAX_LENGTH = () => new FloorDoorModel('A'.repeat(FLOOR_DOOR_VALUE_MAX_LENGTH))
const VALID_FLOOR_DOOR_MODEL_MIN_LENGTH_HUN_LETTER_ONLY = () => new FloorDoorModel('á')
const VALID_FLOOR_DOOR_MODEL_HUN_LETTER_SLASH_HUN_LETTER = () => new FloorDoorModel('áÉű/Ó')

describe('FloorDoorModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, format, and length errors for undefined', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_UNDEFINED,
      [ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_DOOR_VALUE_FORMAT, ERR_MSG_FLOOR_DOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required, format, and length errors for null', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_NULL,
      [ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_DOOR_VALUE_FORMAT, ERR_MSG_FLOOR_DOOR_VALUE_LENGTH],
      3
    )
  })
  
  it('should throw required, format, and length errors for empty string', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_EMPTY,
      [ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_DOOR_VALUE_FORMAT, ERR_MSG_FLOOR_DOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_SPACE_ONLY,
      [ERR_MSG_FLOOR_DOOR_VALUE_REQUIRED, ERR_MSG_FLOOR_DOOR_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_TOO_LONG,
      [ERR_MSG_FLOOR_DOOR_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for leading spaces', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_LEADING_SPACES,
      [ERR_MSG_FLOOR_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for trailing spaces', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_TRAILING_SPACES,
      [ERR_MSG_FLOOR_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for leading and trailing spaces', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_LEADING_TRAILING_SPACES,
      [ERR_MSG_FLOOR_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for contains spaces', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_CONTAINS_SPACES,
      [ERR_MSG_FLOOR_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for invalid format', () => {
    expectErrorMessages(
      ERR_FLOOR_DOOR_MODEL_INVALID_FORMAT,
      [ERR_MSG_FLOOR_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new FloorDoorModel('2/A')
    const b = new FloorDoorModel('3/B')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new FloorDoorModel('2/A')
    expect(a.equals(null)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new FloorDoorModel('2/A')
    expect(a.equals(undefined)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid number/slash/number', () => {
    expect(VALID_FLOOR_DOOR_MODEL_NUMBER_SLASH_NUMBER).not.toThrow()
  })

  it('should accept valid letter/slash/letter', () => {
    expect(VALID_FLOOR_DOOR_MODEL_LETTER_SLASH_LETTER).not.toThrow()
  })

  it('should accept valid letter/slash/number', () => {
    expect(VALID_FLOOR_DOOR_MODEL_LETTER_SLASH_NUMBER).not.toThrow()
  })

  it('should accept valid number/slash/letter', () => {
    expect(VALID_FLOOR_DOOR_MODEL_NUMBER_SLASH_LETTER).not.toThrow()
  })

  it('should accept valid number+hunletter/slash/hunletter', () => {
    expect(VALID_FLOOR_DOOR_MODEL_NUMBER_NUMBER_HUN_LETTER_SLASH_HUN_LETTER).not.toThrow()
  })

  it('should accept valid dash-number/slash/letter', () => {
    expect(VALID_FLOOR_DOOR_MODEL_DASH_NUMBER_SLASH_LETTER).not.toThrow()
  })

  it('should accept valid number+letter', () => {
    expect(VALID_FLOOR_DOOR_MODEL_NUMBER_LETTER).not.toThrow()
  })

  it('should accept valid dash-number+letter', () => {
    expect(VALID_FLOOR_DOOR_MODEL_DASH_NUMBER_LETTER).not.toThrow()
  })

  it('should accept valid number only', () => {
    expect(VALID_FLOOR_DOOR_MODEL_NUMBER_FLOOR_ONLY).not.toThrow()
  })

  it('should accept valid min length number only', () => {
    expect(VALID_FLOOR_DOOR_MODEL_MIN_LENGTH_NUMBER_ONLY).not.toThrow()
  })

  it('should accept valid min length letter only', () => {
    expect(VALID_FLOOR_DOOR_MODEL_MIN_LENGTH_LETTER_ONLY).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_FLOOR_DOOR_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should accept valid min length Hungarian letter only', () => {
    expect(VALID_FLOOR_DOOR_MODEL_MIN_LENGTH_HUN_LETTER_ONLY).not.toThrow()
  })

  it('should accept valid Hungarian letter/slash/Hungarian letter', () => {
    expect(VALID_FLOOR_DOOR_MODEL_HUN_LETTER_SLASH_HUN_LETTER).not.toThrow()
  })

  it('should return true for same value (case-insensitive)', () => {
    const a = new FloorDoorModel('2/A')
    const b = new FloorDoorModel('2/a')
    expect(a.equals(b)).toBe(true)
  })

  it('should return true for valid Hungarian letters with different cases', () => {
    const a = new FloorDoorModel('áÉű/Ó')
    const b = new FloorDoorModel('ÁéŰ/ó')
    expect(a.equals(b)).toBe(true)
  })
})
