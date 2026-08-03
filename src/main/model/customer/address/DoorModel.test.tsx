import { DoorModel } from './DoorModel'
import {
  DOOR_VALUE_MAX_LENGTH,
  ERR_MSG_DOOR_VALUE_REQUIRED,
  ERR_MSG_DOOR_VALUE_FORMAT,
  ERR_MSG_DOOR_VALUE_LENGTH
} from '../../../utils/customer/address/DoorUtils'
import { expectErrorMessages } from '../../../utils/test/ExpectErrorMessages'

// Invalid cases
const ERR_DOOR_MODEL_UNDEFINED = () => new DoorModel(undefined as any)
const ERR_DOOR_MODEL_NULL = () => new DoorModel(null as any)
const ERR_DOOR_MODEL_EMPTY = () => new DoorModel('')
const ERR_DOOR_MODEL_SPACE_ONLY = () => new DoorModel(' ')
const ERR_DOOR_MODEL_TOO_LONG = () => new DoorModel('A'.repeat(DOOR_VALUE_MAX_LENGTH + 1))
const ERR_DOOR_MODEL_CONTAINS_SPACES = () => new DoorModel('A 1')
const ERR_DOOR_MODEL_CONTAINS_DASH = () => new DoorModel('-1')
const ERR_DOOR_MODEL_CONTAINS_SLASH = () => new DoorModel('A/1')

// Valid cases
const VALID_DOOR_MODEL_NUMBER = () => new DoorModel('8')
const VALID_DOOR_MODEL_LETTER = () => new DoorModel('A')
const VALID_DOOR_MODEL_HUN_LETTER = () => new DoorModel('á')
const VALID_DOOR_MODEL_MAX_LENGTH = () => new DoorModel('A'.repeat(DOOR_VALUE_MAX_LENGTH))

describe('DoorModel', () => {

  // ###### #####  #####   ####  #####
  // #      #    # #    # #    # #    #
  // ####   #####  #####  #    # #####
  // #      #    # #    # #    # #    #
  // ###### #    # #    #  ####  #    #

  it('should throw required, format, and length errors for undefined', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_UNDEFINED,
      [ERR_MSG_DOOR_VALUE_REQUIRED, ERR_MSG_DOOR_VALUE_FORMAT, ERR_MSG_DOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required, format, and length errors for null', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_NULL,
      [ERR_MSG_DOOR_VALUE_REQUIRED, ERR_MSG_DOOR_VALUE_FORMAT, ERR_MSG_DOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required, format, and length errors for empty string', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_EMPTY,
      [ERR_MSG_DOOR_VALUE_REQUIRED, ERR_MSG_DOOR_VALUE_FORMAT, ERR_MSG_DOOR_VALUE_LENGTH],
      3
    )
  })

  it('should throw required and format errors for space-only string', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_SPACE_ONLY,
      [ERR_MSG_DOOR_VALUE_REQUIRED, ERR_MSG_DOOR_VALUE_FORMAT],
      2
    )
  })

  it('should throw length error for too long', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_TOO_LONG,
      [ERR_MSG_DOOR_VALUE_LENGTH],
      1
    )
  })

  it('should throw format error for contains spaces', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_CONTAINS_SPACES,
      [ERR_MSG_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for contains dash', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_CONTAINS_DASH,
      [ERR_MSG_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should throw format error for contains slash', () => {
    expectErrorMessages(
      ERR_DOOR_MODEL_CONTAINS_SLASH,
      [ERR_MSG_DOOR_VALUE_FORMAT],
      1
    )
  })

  it('should return false for different values', () => {
    const a = new DoorModel('A')
    const b = new DoorModel('B')
    expect(a.equals(b)).toBe(false)
  })

  it('should return false if other is null', () => {
    const a = new DoorModel('A')
    expect(a.equals(null)).toBe(false)
  })

  it('should return false if other is undefined', () => {
    const a = new DoorModel('A')
    expect(a.equals(undefined)).toBe(false)
  })

  // ###### #    #  #####  ##### ###### ###### ###### ######
  // #      #    # #      #      #      #      #      #
  // ###### #    # #      #      ####   ####   ###### ######
  //      # #    # #      #      #      #           #      #
  // ######  ####   #####  ##### ###### ###### ###### ######

  it('should accept valid number', () => {
    expect(VALID_DOOR_MODEL_NUMBER).not.toThrow()
  })

  it('should accept valid letter', () => {
    expect(VALID_DOOR_MODEL_LETTER).not.toThrow()
  })

  it('should accept valid Hungarian letter', () => {
    expect(VALID_DOOR_MODEL_HUN_LETTER).not.toThrow()
  })

  it('should accept valid max length', () => {
    expect(VALID_DOOR_MODEL_MAX_LENGTH).not.toThrow()
  })

  it('should return true for same value (case-insensitive)', () => {
    const a = new DoorModel('a')
    const b = new DoorModel('A')
    expect(a.equals(b)).toBe(true)
  })
})
